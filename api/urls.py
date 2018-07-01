from django.urls import path

from . import views

urlpatterns = [
    path('entries/', views.EntryList.as_view())
]
