import json
import os

from django.contrib.staticfiles.storage import staticfiles_storage
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView

@csrf_exempt
def get_route(request):

    if request.method == 'POST':
        return JsonResponse({'context': request.POST}, status=200)
    return render(request, 'index.html')

class IndexView(TemplateView):
    template_name = 'app_main/index.html'





