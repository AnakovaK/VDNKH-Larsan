from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib import messages
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse_lazy, reverse
from django.views.generic import FormView, UpdateView, DetailView
from taggit.models import Tag

from .forms import SignUpForm, ChoiceForm
from .models import Visitor


class SignUpView(FormView):
    template_name = 'app_users/sign-up.html'
    form_class = SignUpForm

    def get_success_url(self):
        return reverse('profile', kwargs={'pk': self.object.id})

    def form_valid(self, form):
        user = form.save()
        username = form.cleaned_data.get('username')
        raw_password = form.cleaned_data.get('password1')
        user = authenticate(username=username, password=raw_password)
        login(self.request, user)
        return HttpResponseRedirect(reverse('home'))


class MyLoginView(LoginView):
    template_name = 'app_users/login.html'
    next_page = reverse_lazy('home')


class MyLogoutView(LogoutView):
    template_name = 'app_users/logout.html'
    next_page = reverse_lazy('home')


def addtag(request):
    if request.method == "POST":
        name = request.POST.get('name')
        visitor = request.user.visitor
        visitor.tags.add(f"{name}")
        visitor.save()
        messages.info(request, 'Вы удачно добавили тег!')
        return


class ProfileDetailView(DetailView):
    template_name = 'app_users/profile.html'
    model = User
    context_object_name = 'user'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        tag_names = [tag.name for tag in Tag.objects.all()]
        context['all_tags'] = tag_names
        form = ChoiceForm()
        context['form'] = form
        return context

    def post(self, request, *args, **kwargs):
        vis3 = request.user.visitor.tags.all()
        vis4 = request.user.visitor
        addtag(request)
        return HttpResponseRedirect(reverse('profile', kwargs={'pk':  self.kwargs['pk']}))


class ProfileUpdateView(UpdateView):
    template_name = 'app_users/redact.html'
    model = User
    context_object_name = 'profile'
    fields = ("username", "first_name", "last_name", "email")

    def get_success_url(self):
        return reverse('profile', kwargs={'pk': self.object.id})

    def form_valid(self, form):
        form.save()
        return HttpResponseRedirect(self.get_success_url())
