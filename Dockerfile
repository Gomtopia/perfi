FROM python:3.6.5

RUN pip install django=="2.0.5"
RUN pip install djangorestframework

WORKDIR app

CMD python manage.py runserver 0.0.0.0:8000 2>&1
