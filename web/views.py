from django.shortcuts import render

# Create your views here.
def account(request):
    return render(request, 'web/account.html')

def entry(request):
    return render(request, 'web/entry.html')

def import_entries(request):
    return render(request, 'web/import_entries.html')

def statistics(request):
    return render(request, 'web/statistics.html')
