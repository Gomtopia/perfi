FROM python:3.6.5

RUN pip install django=="2.0.5"

WORKDIR app

CMD python manage.py runserver 2>&1
