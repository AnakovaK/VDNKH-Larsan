from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User
from django.contrib.auth.views import LoginView, LogoutView
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse_lazy, reverse
from django.views.generic import FormView, UpdateView, DetailView

from .forms import SignUpForm


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
    next_page = reverse_lazy('login')


class ProfileDetailView(DetailView):
    template_name = 'app_users/profile.html'
    model = User
    context_object_name = 'user'


class ProfileUpdateView(UpdateView):
    template_name = 'app_users/profile_redact.html'
    model = User
    context_object_name = 'user'
    fields = ('about', 'avatar')

    def get_success_url(self):
        return reverse('profile', kwargs={'pk': self.object.id})

    def form_valid(self, form):
        form.save()
        return HttpResponseRedirect(self.get_success_url())