FROM python:3.8.2

WORKDIR /app
RUN apt-get update -y \
    && pip install --upgrade pip \
    && apt-get install --reinstall build-essential -y \
    && apt-get install -y --no-install-recommends \
    unixodbc-dev \
    unixodbc \
    libpq-dev \
    freetds-dev \
    freetds-bin \
    tdsodbc

# populate "ocbcinst.ini"
RUN echo "[FreeTDS]\n\
    Description = FreeTDS unixODBC Driver\n\
    Driver = /usr/lib/x86_64-linux-gnu/odbc/libtdsodbc.so\n\
    Setup = /usr/lib/x86_64-linux-gnu/odbc/libtdsS.so" >> /etc/odbcinst.ini

COPY requirements.txt /app/requirements.txt

RUN pip install -r requirements.txt

COPY src/ /app/src/

WORKDIR /app/src

EXPOSE 5000

CMD [ "python" , "./app.py" ]