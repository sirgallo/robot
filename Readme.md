# Robot

### A test for serving robots.txt through haproxy


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