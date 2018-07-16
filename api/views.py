import csv
import io

from django.http import HttpResponse
from rest_framework import generics
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import AccountSerializer, EntrySerializer
from .models import Account, Entry


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

class EntryViewSet(viewsets.ModelViewSet):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer


class DraftEntryView(APIView):
    def post(self, request, format=None):
        if 'file' not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        sfcu_data = request.data['file'].open('r').read().decode('utf-8')
        draft_entries = self.extract_draft_entries(sfcu_data)
        serializer = EntrySerializer(draft_entries, many=True)
        return Response(serializer.data)

    def extract_draft_entries(self, sfcu_data):
        draft_entries = []
        cnt = 1
        reader = csv.DictReader(io.StringIO(sfcu_data))
        for row in reader:
            desc = row['Description']
            if row['Check']:
                desc += row['Check']
            debit = float(row['Debit']) if row['Debit'] else 0
            credit = float(row['Credit']) if row['Credit'] else 0
            entry = Entry(id = cnt, description = desc, amount = abs(credit-debit), date = row['Post Date'])
            cnt += 1
            draft_entries.append(entry)
        return draft_entries
