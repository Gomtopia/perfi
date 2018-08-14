from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Account, Entry


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'

class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = '__all__'

    def to_internal_value(self, data):
        data['debit'] = Account.objects.get(user_id=data['user_id'], name=data['debit']).id
        data['credit'] = Account.objects.get(user_id=data['user_id'], name=data['credit']).id
        return super(EntrySerializer, self).to_internal_value(data)

    def to_representation(self, instance):
        data = super(EntrySerializer, self).to_representation(instance)
        data['debit'] = instance.debit.name
        data['credit'] = instance.credit.name
        return data

class DraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = ('id', 'description', 'amount', 'date')
