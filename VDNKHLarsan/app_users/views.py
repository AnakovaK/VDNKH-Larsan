from django.contrib.auth import login, authenticate
# from django.contrib.auth.models import User
from django.contrib.auth.views import LoginView, LogoutView
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse_lazy, reverse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import FormView, UpdateView, DetailView, CreateView
from taggit.models import Tag

from .forms import SignUpForm, LoginForm, ProfileForm
from .models import User, CustomRoute, RoutePoint


class SignUpView(CreateView):
    template_name = 'app_users/sign-up.html'
    form_class = SignUpForm
    model = User
    success_url = reverse_lazy('home')

    def form_valid(self, form):
        user = form.save()
        username = form.cleaned_data.get('username')
        raw_password = form.cleaned_data.get('password1')
        user = authenticate(username=username, password=raw_password)
        login(self.request, user)
        return HttpResponseRedirect(self.success_url)


class MyLoginView(LoginView):
    template_name = 'app_users/login.html'
    next_page = reverse_lazy('home')
    form_class = LoginForm


class MyLogoutView(LogoutView):
    template_name = 'app_users/logout.html'
    next_page = reverse_lazy('home')


class ProfileDetailView(DetailView):
    template_name = 'app_users/profile.html'
    model = User
    context_object_name = 'profile'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        tag_names = [tag.name for tag in Tag.objects.all()]
        context['all_tags'] = tag_names
        return context

    def post(self, request, *args, **kwargs):
        if 'create_route' in request.POST:
            route = create_custom_route(request)
            return HttpResponseRedirect(
                reverse('custom-route-detail', kwargs={'user_id': request.user.id, 'pk': route.id}))
        elif 'add_tag' in request.POST:
            addtag(request)
            return render(request, template_name=self.template_name, context=self.get_context_data(**kwargs))


class ProfileUpdateView(UpdateView):
    template_name = 'app_users/redact.html'
    model = User
    context_object_name = 'profile'
    form_class = ProfileForm

    def get_success_url(self):
        return reverse('profile', kwargs={'pk': self.object.id})


def addtag(request):
    if request.method == "POST":
        name = request.POST.get('name')
        user = request.user
        user.tags.add(f"{name}")
        user.save()


def create_custom_route(request):
    if request.method == "POST":
        route = CustomRoute.objects.create(
            user=request.user
        )
        return route


# def add_route_point(request):


@method_decorator(csrf_exempt, name='dispatch')
class CustomRouteDetailView(DetailView):
    template_name = 'app_users/custom-route-detail.html'
    model = CustomRoute
    context_object_name = 'route'

    def post(self, request, user_id, pk):
        place_id = request.POST.get('placeId')
        route_to_change = CustomRoute.objects.get(id=pk)
        new_point = RoutePoint(point=place_id)
        new_point.save()
        route_to_change.route_points.add(new_point)
        route_to_change.save()
        return JsonResponse({'context': request.POST}, status=200)
