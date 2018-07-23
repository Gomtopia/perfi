from django.urls import path

from . import views

urlpatterns = [
    path('account', views.account, name='account'),
    path('entry', views.entry, name='entry'),
    path('import', views.import_entries, name='import_entries'),
    path('statistics', views.statistics, name='statistics'),
]
