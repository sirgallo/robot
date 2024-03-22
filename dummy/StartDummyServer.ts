import { serverConfiguration } from '../ServerConfigurations';
import { DummyServer } from '@dummy/DummyServer';


const server = new DummyServer(
  serverConfiguration.basePath,
  serverConfiguration.systems.dummy
);

try {
  server.startServer();
} catch (err) { console.log(err); }