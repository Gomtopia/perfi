import csv
import io
from datetime import date, datetime
from dateutil.relativedelta import relativedelta

from django.db.models import F, Sum
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.http import HttpResponse
from rest_framework import generics
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import AccountSerializer, EntrySerializer, UserSerializer, DraftSerializer
from .models import Account, Entry

class AccountViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    serializer_class = AccountSerializer

    def get_queryset(self):
        return Account.objects.filter(user_id=self.request.user.id)

class EntryViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    serializer_class = EntrySerializer

    def create(self, request, *args, **kwargs):
        request.data['user_id'] = request.user.id
        return super(EntryViewSet, self).create(request, args, kwargs);

    def update(self, request, *args, **kwargs):
        request.data['user_id'] = request.user.id
        return super(EntryViewSet, self).update(request, args, kwargs);

    def get_queryset(self):
        return Entry.objects.filter(user_id=self.request.user.id)

class UserView(APIView):
    def get(self, request, format=None):
        return Response({
            'is_authenticated': request.user.is_authenticated,
            'user': UserSerializer(request.user).data
        })

    def post(self, request, format=None):
        user = User.objects.create(**request.data)
        return Response(UserSerializer(user).data)

class LoginView(APIView):
    def post(self, request, format=None):
        user = authenticate(request, **request.data)
        if user is not None:
            login(request, user)
            return Response(UserSerializer(user).data)
        else:
            return Response('Unable to log in')

class LogoutView(APIView):
    def get(self, request, format=None):
        logout(request)
        return Response('Logout success')

class DraftEntryView(APIView):
    def post(self, request, format=None):
        if 'file' not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        sfcu_data = request.data['file'].open('r').read().decode('utf-8')
        draft_entries = self.extract_draft_entries(sfcu_data)
        serializer = DraftSerializer(draft_entries, many=True)
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
            post_date = datetime.strptime(row['Post Date'], '%m/%d/%Y')
            entry = Entry(id = cnt,
                          description = desc,
                          amount = abs(credit-debit),
                          date = post_date.strftime('%Y-%m-%d'))
            cnt += 1
            draft_entries.append(entry)
        return draft_entries

class StatisticsView(LoginRequiredMixin, APIView):
    def get(self, request, format=None):
        today = date.today()

        monthly_data = {}
        for i in range(0, 6):
            cur_month = today.month-i
            monthly_data[cur_month] = {}
            entries = Entry.objects.all() if i == 0 else Entry.objects.filter(date__lt=date(today.year, today.month, 1)-relativedelta(months=i-1))

            asset_debit = entries.filter(debit__account_type='ASSET').aggregate(value=Sum('amount'))
            asset_credit = entries.filter(credit__account_type='ASSET').aggregate(value=Sum('amount'))
            monthly_data[cur_month]['asset'] = 0 if asset_debit['value'] is None else asset_debit['value']
            monthly_data[cur_month]['asset'] -= 0 if asset_credit['value'] is None else asset_credit['value']

            liability_debit = entries.filter(debit__account_type='LIABILITY').aggregate(value=Sum('amount'))
            liability_credit = entries.filter(credit__account_type='LIABILITY').aggregate(value=Sum('amount'))
            monthly_data[cur_month]['liability'] = 0 if liability_credit['value'] is None else liability_credit['value']
            monthly_data[cur_month]['liability'] -= 0 if liability_debit['value'] is None else liability_debit['value']

            income = Entry.objects.filter(credit__account_type='INCOME', date__year=today.year, date__month=cur_month).aggregate(value=Sum('amount'))
            monthly_data[cur_month]['income'] = 0 if income['value'] is None else income['value']
            expense = Entry.objects.filter(debit__account_type='EXPENSE', date__year=today.year, date__month=cur_month).aggregate(value=Sum('amount'))
            monthly_data[cur_month]['expense'] = 0 if expense['value'] is None else expense['value']

        recent_1m_expenses = Entry.objects.filter(debit__account_type='EXPENSE', date__gt=today-relativedelta(months=1)).values(name=F('debit')).annotate(value=Sum('amount'))
        data = {
            'monthly_data': self.tolist(monthly_data),
            'recent_1m_expenses': recent_1m_expenses
        }

        return Response(data)

    def tolist(self, monthly_data):
        monthly_data_list = []
        for month, data in sorted(monthly_data.items()):
            data['month'] = month
            monthly_data_list.append(data)

        return monthly_data_list
