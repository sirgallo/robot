import { BaseServer } from '@baseServer/core/BaseServer';
import { ServerConfiguration } from '@core/baseServer/core/types/ServerConfiguration';
import { ApplicableSystems } from '../ServerConfigurations';


export class RobotServer extends BaseServer<ApplicableSystems> {
  constructor(private basePath: string, opts: ServerConfiguration<ApplicableSystems>) { 
    super(opts); 
  }

  async initService(): Promise<boolean> {
    this.zLog.info('robot server starting...');
    return true;
  }

  async startEventListeners(): Promise<void> {
    return null;
  };
}