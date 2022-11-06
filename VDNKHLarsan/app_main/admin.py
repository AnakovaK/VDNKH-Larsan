from django.contrib import admin

from .models import Place, Route


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'points']
