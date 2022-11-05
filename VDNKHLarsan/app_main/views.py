from django.http import HttpResponseRedirect
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import TemplateView, ListView, DetailView, FormView

from .forms import UploadForm
from .models import Route, Place


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
    slug_field = 'code'


class PlaceDetailView(DetailView):
    template_name = 'app_main/map/place-detail.html'
    model = Place
    context_object_name = 'place'

class UploadPlacesRoutesFormView(FormView):
    template_name = 'app_main/upload.html'
    form_class = UploadForm
    success_url = reverse_lazy('map')

    def form_valid(self, form):
        json_file = self.request.FILES['json_file']
        import json
        data = json.load(json_file)
        for place in data['places'].values():
            try:
                place_id = place['id']
                order = place['order']
                name = place['title']
                map_title = place['map_title']
                pic_url = 'https://vdnh.ru' + place['pic']
                lon = list(place['coordinates'])[0]
                lat = list(place['coordinates'])[1]
                try:
                    place = Place.objects.get(id=place_id)
                    place.order = order
                    place.name = name
                    place.map_title = map_title
                    place.pic_url = pic_url
                    place.lon = lon
                    place.lat = lat
                    place.save()
                except Place.DoesNotExist:
                    Place.objects.create(
                        id=place_id,
                        order=order,
                        name=name,
                        map_title=map_title,
                        pic_url=pic_url,
                        lon=lon,
                        lat=lat
                    )
            except KeyError:
                continue
        for route in data['routes']:
            try:
                route_id = route['id']
                name = route['title']
                code = route['code']
                pic_url = route['pic']
                detail_pic_url = route['detail_pic']
                detail_text = route['detail']
                try:
                    route_obj = Route.objects.get(id=route_id)
                    route_obj.name = name
                    route_obj.code = code
                    route_obj.pic_url = pic_url
                    route_obj.detail_pic_url = detail_pic_url
                    route_obj.detail_text = detail_text
                except Route.DoesNotExist:
                    route_obj = Route.objects.create(
                        id=route_id,
                        name=name,
                        code=code,
                        pic_url=pic_url,
                        detail_pic_url=detail_pic_url,
                        detail_text=detail_text,
                    )
                    for item in route['items']:
                        route_obj.places.add(Place.objects.get(id=item['place']))
                route_obj.save()
            except KeyError:
                continue
        return HttpResponseRedirect(self.success_url)
