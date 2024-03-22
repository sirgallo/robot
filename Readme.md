# Robot

### A test for serving robots.txt through haproxy


## Setup

**Ensure that the following are installed on target machine**

`docker` - install the latest docker-desktop for mac/windows [here](https://www.docker.com/products/docker-desktop/).
`nodejs` - install the latest node.js [here](https://nodejs.org/en).


## Certs

Run [generateCerts](./generateCerts.sh) to guide through setting up root ca and service certs for solt.
```bash
./generateCerts.sh
```

certs are generated under `~/robot/certs` on the host machine.


## Deployment

In the `root` of the project, first build `Dockerfile.buildapi`, which creates a nodejs preimage shared between the different services:
```bash
./buildpreimages.sh
```

Then, to run a development cluster, deploy using docker through [startupDev](./startupDev.sh):
```bash
./startupDev.sh
```

To stop the services, run:
```bash
./stopDev.sh
```