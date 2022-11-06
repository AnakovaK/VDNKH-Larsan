from django.contrib.auth.models import AbstractUser
from django.db import models
from taggit.managers import TaggableManager


class User(AbstractUser):
    patronymic = models.CharField(max_length=55, blank=True, verbose_name='Отчество')
    born = models.DateField(verbose_name='Дата рождения', null=True)
    tags = TaggableManager()

    @property
    def age(self):
        from datetime import date
        today = date.today()
        return today.year - self.born.year - ((today.month, today.day) < (self.born.month, self.born.day))

    def __str__(self):
        return self.first_name + " " + self.last_name + " " + self.patronymic

    def get_tags(self):
        return self.tags


class RoutePoint(models.Model):
    point = models.IntegerField()
    title = models.CharField(max_length=255, blank=True)
    site_url = models.CharField(max_length=255, blank=True)
    img_url = models.CharField(max_length=255, blank=True)
    ticket_url = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return str(self.title)


class CustomRoute(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='custom_routes', verbose_name='Пользователь')
    route_points = models.ManyToManyField(RoutePoint, blank=True)

    def __str__(self):
        all_points = ", ".join(str(seg) for seg in self.route_points.all())
        return "{}".format(all_points)
