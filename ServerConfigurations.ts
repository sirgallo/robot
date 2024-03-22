import { homedir } from 'os';
import { join } from 'path';
import { ServerConfigMapping, ServerConfiguration } from '@core/baseServer/core/types/ServerConfiguration';


export type ApplicableSystems = 'robot' | 'dummy';

export const systems: { [server in ApplicableSystems]: ServerConfiguration<server> } = {
  robot: {
    port: 1234,
    name: 'robot api',
    numOfCpus: 1,
    version: '0.0.1-dev',
    staticFilesDir: join(homedir(), 'api', 'public')
  },
  dummy: {
    port: 2468,
    name: 'dummy api',
    numOfCpus: 1,
    version: '0.0.1-dev'
  }
};

export const serverConfiguration: ServerConfigMapping<ApplicableSystems> = {
  basePath: '/b_v1',
  systems
};