from django.http import HttpResponse
from rest_framework import generics
from .serializers import AccountSerializer, EntrySerializer
from .models import Account, Entry

class AccountList(generics.ListCreateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

class EntryList(generics.ListCreateAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
