from django.urls import path

from . import views

urlpatterns = [
    path('account', views.account, name='account'),
    path('entry', views.entry, name='entry'),
]
