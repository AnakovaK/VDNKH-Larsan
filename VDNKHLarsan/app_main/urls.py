from django.urls import path


from . import views

urlpatterns = [
    path('', views.IndexView.as_view(), name='home'),
    path('map/', views.MapView.as_view(), name='map'),
    path('routes/', views.RouteListView.as_view(), name='route-list'),
    path('heatmap/', views.HeatmapView.as_view(), name='heatmap'),
    path('routes/<slug:slug>/', views.RouteDetailView.as_view(), name='route-detail'),
    path('routes/<int:pk>/', views.PlaceDetailView.as_view(), name='place-detail'),
    path('upload/', views.UploadPlacesRoutesFormView.as_view(), name='upload'),
]