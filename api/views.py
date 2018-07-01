from django.http import HttpResponse
from rest_framework import generics
from .serializers import AccountSerializer, EntrySerializer
from .models import Account, Entry
from rest_framework import viewsets

class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

class EntryViewSet(viewsets.ModelViewSet):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
