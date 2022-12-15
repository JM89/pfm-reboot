# Savings Tracker API

Python Flask API to track savings into bank accounts.

## Requirements

- Docker
- Python (tested on v3.8.2)

## Getting Started

Start a local database SQL server, with two tables for our API and a user account for the app (credentials available in
tf parameter store):

```
docker-compose -f docker/docker-compose-db.yml -f docker/docker-compose-monitoring.yml -f docker/docker-compose-infra.yml up
```

Install app dependencies in your virtual env:

```
pip install -r requirements.txt
```

Start the API:

```
python app.py
```

You can then test the API by using the Postman collection.

## Swagger

Go to http://127.0.0.1:5000/apidocs/

[Reference Swagger Doc](https://swagger.io/specification/)

## Logging

To see the application logs in local, go to http://localhost/#/events.

Reference:

- [Graylog Extended Log Format (GELF)](https://archivedocs.graylog.org/en/2.5/pages/gelf.html)
- [pygelf package](https://github.com/keeprocking/pygelf)

## Debug docker image

```commandline
docker run -it --entrypoint=/bin/bash local-testing:latest -i
```

## Local parameters

```
aws ssm describe-parameters --endpoint http://localhost:4566 --region eu-west-2
```