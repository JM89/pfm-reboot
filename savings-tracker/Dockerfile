FROM python:3.8.2

WORKDIR /app
RUN apt-get update -y && pip install --upgrade pip && apt-get install -y --no-install-recommends \
    unixodbc-dev \
    unixodbc \
    libpq-dev

COPY requirements.txt /app/requirements.txt

RUN pip install -r requirements.txt

COPY src/ /app/src/
COPY configs/config.docker.ini /app/configs/config.ini

WORKDIR /app/src

EXPOSE 5000

CMD [ "python" , "./app.py" ]