FROM python:3.6.5

RUN pip install django=="2.0.5"
RUN pip install djangorestframework

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y npm

WORKDIR perfi

CMD python manage.py runserver 0.0.0.0:8000 2>&1
