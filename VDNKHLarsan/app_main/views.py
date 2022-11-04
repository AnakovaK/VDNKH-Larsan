import json
import os

from django.contrib.staticfiles.storage import staticfiles_storage
from django.http import JsonResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView, ListView, DetailView

from .models import Route, CustomRoute, RoutePoint
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView


class IndexView(TemplateView):
    template_name = 'app_main/index.html'


@method_decorator(csrf_exempt, name='dispatch')
class MapView(TemplateView):
    template_name = 'app_main/map/map.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['route'] = CustomRoute.objects.all()
        return context

    def post(self, request):
        place_id = request.POST.get('placeId')
        to_change = CustomRoute.objects.all().first()
        new_point = RoutePoint(point=place_id)
        new_point.save()
        to_change.route_points.add(new_point)
        to_change.save()
        return JsonResponse({'context': request.POST}, status=200)




class RouteListView(ListView):
    template_name = 'app_main/map/route-list.html'
    model = Route
    context_object_name = 'routes'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['route'] = CustomRoute.objects.all()
        return context


class RouteDetailView(DetailView):
    template_name = 'app_main/map/route-detail.html'
    model = Route
    context_object_name = 'route'





