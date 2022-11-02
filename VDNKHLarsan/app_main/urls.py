from django.urls import path

from . import views

urlpatterns = [
    path('', views.IndexView.as_view(), name='home'),
    path('/map/', views.MapView.as_view(), name='map'),
]