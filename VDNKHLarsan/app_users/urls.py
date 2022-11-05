from django.urls import path
from . import views

urlpatterns = [
    path('sign-up/', views.SignUpView.as_view(), name='sign-up'),
    path('login/', views.MyLoginView.as_view(), name='login'),
    path('logout/', views.MyLogoutView.as_view(), name='logout'),
    path('profile/<int:pk>/', views.ProfileDetailView.as_view(), name='profile'),
    path('profile/<int:pk>/redact/', views.ProfileUpdateView.as_view(), name='profile-redact'),
    path('profile/<int:pk>/', views.addtag, name='addtag'),
    path('profile/<int:pk>/', views.create_custom_route, name='custom-route_create'),
    path('profile/<int:user_id>/route/<int:pk>/', views.CustomRouteDetailView.as_view(), name='custom-route-detail'),
]