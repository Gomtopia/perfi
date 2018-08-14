from django.contrib.auth.models import User
from django.db import models

class Account(models.Model):
    ASSET = 'ASSET'
    LIABILITY = 'LIABILITY'
    INCOME = 'INCOME'
    EXPENSE = 'EXPENSE'
    ACCOUNT_TYPE_CHOICES = (
        (ASSET, 'Asset'),
        (LIABILITY,'Liability'),
        (INCOME, 'Income'),
        (EXPENSE, 'Expense'),
    )

    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=128)
    account_type = models.CharField(
        max_length = 16,
        choices = ACCOUNT_TYPE_CHOICES,
        default = ASSET,
    )

    class Meta:
        unique_together = ("user_id", "name")

class Entry(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    debit = models.ForeignKey(Account, related_name='debit_account', on_delete=models.PROTECT)
    credit = models.ForeignKey(Account, related_name='credit_account', on_delete=models.PROTECT)
    description = models.CharField(max_length=256)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField()
