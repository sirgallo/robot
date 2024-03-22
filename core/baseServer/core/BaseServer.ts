import express from 'express';
import cluster from 'cluster';
import { config } from 'dotenv';
import * as os from 'os';
import createError from 'http-errors';
import * as e from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

import { LogProvider } from '@core/providers/LogProvider';
import { ServerOpts, DEFAULT_SERVER_OPTS } from '@core/baseServer/core/types/Server';
import { PollRoute } from '@core/baseServer/routes/PollRoute';
import { routeMappings } from '@core/baseServer/configs/RouteMappings';
import { extractErrorMessage } from '@core/utils/Utils';
import { ServerConfiguration } from './types/ServerConfiguration';


config({ path: '.env' });


/*
Base Server

  --> initialize express app
  --> if primary 
      --> fork workers
  --> if worker
      --> initialize routes
      --> start service
      --> listen on default port
*/
export abstract class BaseServer<T extends string> {
  name: string;

  protected app: e.Application;
  protected ip: string;
  protected port: number;
  protected version: string;
  protected staticFilesDir: string = 'public';

  protected numOfCpus: number = os.cpus().length;
  protected routes: any[] = [ new PollRoute(routeMappings.poll.name) ];
  protected zLog: LogProvider;

  constructor(opts: ServerConfiguration<T>) {
    this.name = opts.name;
    this.zLog = new LogProvider(this.name);

    this.port = opts.port;
    this.version = opts.version;
    this.numOfCpus = opts.numOfCpus;
    if (opts?.staticFilesDir) this.staticFilesDir = opts.staticFilesDir;
  }

  getIp = () => this.ip;
  setRoutes = (routes: any[]) => this.routes = this.routes.concat(routes);

  async startServer() {
    try {
      await this.initService();
      this.run();
      this.startEventListeners();
    } catch(err) {
      this.zLog.error(`error message: ${err.message}`);
      throw err;
    }
  }

  abstract initService(): Promise<boolean>;
  abstract startEventListeners(): Promise<void>;

  private async run() {
    try { 
      this.zLog.info(`Welcome to ${this.name}, version ${this.version}`);
      if (this.numOfCpus > 1) {
        if (cluster.isPrimary) {
          this.zLog.info('...forking workers');

          this.initApp();
          this.setUpWorkers();
        } else if (cluster.isWorker) {
          this.initApp();
          this.initMiddleware();
          this.initRoutes();
          this.setUpServer();
        }
      } else if (this.numOfCpus === 1) {
        this.initApp();
        this.initMiddleware();
        this.initRoutes();
        this.setUpServer();
      } else {
        throw new Error('Number of cpus must be greater than 1.');
      }
    } catch (err) {
      this.zLog.error(extractErrorMessage(err as Error));
      process.exit(1);
    }
  }

  private initApp() {
    try {
      this.app = express();
    } catch (err) {throw Error(`error initializing app => ${extractErrorMessage(err as Error)}`); }
  }

  private initMiddleware() {
    try {
      this.ip = BaseServer.setIp(this.zLog);
      this.app.set('port', this.port);

      this.app.use(e.json());
      this.app.use(e.urlencoded({ extended: false }));
      this.app.use(cookieParser());

      console.log('static files dir:', this.staticFilesDir);
      this.app.use(e.static(this.staticFilesDir));
      this.app.use(compression());
      this.app.use(helmet());
    } catch (err) { throw Error(`error initializing middleware => ${extractErrorMessage(err as Error)}`); }
  }

  private initRoutes() {
    try {
      for (const route of this.routes) {
        this.app.use(route.rootpath, route.router);
        this.zLog.info(`Route: ${route.name} initialized on Worker ${process.pid}.`);
      }

      this.app.use( (req, res, next) => next(createError(404)));
      this.app.use( (err, req, res, next) => res.status(err.status || 500).json({ error: err.message }));
    } catch (err) { throw Error(`error initializing routes => ${extractErrorMessage(err as Error)}`); }
  }

  private setUpServer() {
    this.app.listen(this.port, () => this.zLog.info(`Server ${process.pid} @${this.ip} listening on port ${this.port}...`));
  }

  private setUpWorkers() {
    const fork = () => {
      const f = cluster.fork();
      f.on('message', message => this.zLog.debug(message));
    }

    this.zLog.info(`Server @${this.ip} setting up ${this.numOfCpus} CPUs as workers.\n`);
    for(let cpu = 0; cpu < this.numOfCpus; cpu++) {
      fork();
    }

    cluster.on('online', worker => this.zLog.info(`Worker ${worker.process.pid} is online.`));
    cluster.on('exit', (worker, code, signal) => {
      this.zLog.error(`Worker ${worker.process.pid} died with code ${code} and ${signal}.`);
      this.zLog.warn('Starting new worker...');

      fork();
    });
  }

  static setIp(zLog: LogProvider): string {
    try {
      return Object.keys(os.networkInterfaces()).map(key => {
        if (/(eth[0-9]{1}|enp[0-9]{1}s[0-9]{1})/.test(key)) return os.networkInterfaces()[key][0].address;
      }).filter(el => el)[0];
    } catch (err) {
      zLog.error(`Unable to select network interface: ${err}`);
      process.exit(3);
    }
  }
}