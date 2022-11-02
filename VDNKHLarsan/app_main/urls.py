from django.urls import path

from . import views

urlpatterns = [
    path('', views.IndexView.as_view(), name='home'),
    path('map/', views.MapView.as_view(), name='map'),
    path('map/routes', views.RouteListView.as_view(), name='route-list'),
    path('map/routes/<int:pk>', views.RouteDetailView.as_view(), name='route-detail'),
]