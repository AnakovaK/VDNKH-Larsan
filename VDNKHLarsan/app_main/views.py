import json
import os

from django.contrib.staticfiles.storage import staticfiles_storage
from django.shortcuts import render
from django.views.generic import TemplateView




class IndexView(TemplateView):
    template_name = 'app_main/index.html'



