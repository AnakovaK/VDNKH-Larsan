from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User, CustomRoute, RoutePoint

admin.site.register(User, UserAdmin)


@admin.register(CustomRoute)
class CustomRouteAdmin(admin.ModelAdmin):
    list_display = ('id', 'user',)


@admin.register(RoutePoint)
class CustomRouteAdmin(admin.ModelAdmin):
    list_display = ('id', 'point',)
