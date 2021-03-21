# Savings Tracker API

Python Flask API to track savings into bank accounts. 

## Requirements

- Docker
- Python (tested on v3.38.2)
- Postman (collection available)

## Getting Started

Start a local database SQL server, with two tables for our API and a user account for the app (credentials available in config.ini):

```
docker-compose -f docker/docker-compose.yml up
```

Install app dependencies:
```
pip install -r requirements.txt
```

Start the API:
```
python app.py
```

You can then test the API by using the Postman collection.