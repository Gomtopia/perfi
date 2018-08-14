from django.urls import path
from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'accounts', views.AccountViewSet, 'account')
router.register(r'entries', views.EntryViewSet, 'entry')


urlpatterns = [
    path('', include(router.urls)),
    path('login/', views.LoginView.as_view()),
    path('logout/', views.LogoutView.as_view()),
    path('user/', views.UserView.as_view()),
    path('drafts/', views.DraftEntryView.as_view()),
    path('statistics/', views.StatisticsView.as_view()),
]
