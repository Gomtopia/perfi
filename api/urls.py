from django.urls import path
from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'accounts', views.AccountViewSet)
router.register(r'entries', views.EntryViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('entries/drafts', views.DraftEntryView.as_view()),
]
