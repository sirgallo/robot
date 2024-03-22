export interface ServerOpts {
  name: string;
  port?: number; 
  version?: string;
  numOfCpus?: number;
  staticFilesDir?: string;
}

export const DEFAULT_SERVER_OPTS: Required<Pick<ServerOpts, 'port' | 'version' | 'numOfCpus' | 'staticFilesDir'>> = {
  port: 8000,
  version: '0.1',
  numOfCpus: 1,
  staticFilesDir: 'public'
};