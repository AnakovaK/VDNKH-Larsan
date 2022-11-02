from django.shortcuts import render
from django.views.generic import TemplateView


class IndexView(TemplateView):
    template_name = 'app_main/index.html'


class MapView(TemplateView):
    template_name = 'app_main/map.html'
