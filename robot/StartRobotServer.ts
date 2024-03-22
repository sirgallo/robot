import { serverConfiguration } from '../ServerConfigurations';
import { RobotServer } from '@robot/RobotServer';


const server = new RobotServer(
  serverConfiguration.basePath,
  serverConfiguration.systems.robot
);

try {
  server.startServer();
} catch (err) { console.log(err); }