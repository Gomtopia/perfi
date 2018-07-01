from django.http import HttpResponse
from rest_framework import generics
from .serializers import EntrySerializer
from .models import Entry

class EntryList(generics.ListCreateAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
