from django.shortcuts import render
from django.views.generic import TemplateView, ListView, DetailView

from .models import Route


class IndexView(TemplateView):
    template_name = 'app_main/index.html'


class MapView(TemplateView):
    template_name = 'app_main/map/map.html'


class RouteListView(ListView):
    template_name = 'app_main/map/route-list.html'
    model = Route
    context_object_name = 'routes'


class RouteDetailView(DetailView):
    template_name = 'app_main/map/route-detail.html'
    model = Route
    context_object_name = 'route'
