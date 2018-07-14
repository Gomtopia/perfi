from django.db import models

class Account(models.Model):
    ASSETS = 'ASSETS'
    LIABILITIES = 'LIABILITIES'
    INCOME = 'INCOME'
    EXPENSES = 'EXPENSES'
    ACCOUNT_TYPE_CHOICES = (
        (ASSETS, 'Assets'),
        (LIABILITIES,'Liabilities'),
        (INCOME, 'Income'),
        (EXPENSES, 'Expenses'),
    )

    name = models.CharField(max_length=128, primary_key=True)
    account_type = models.CharField(
        max_length = 16,
        choices = ACCOUNT_TYPE_CHOICES,
        default = ASSETS,
    )

class Entry(models.Model):
    debit = models.ForeignKey(Account, related_name='debit_account', on_delete=models.PROTECT)
    credit = models.ForeignKey(Account, related_name='credit_account', on_delete=models.PROTECT)
    description = models.CharField(max_length=256)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField()
