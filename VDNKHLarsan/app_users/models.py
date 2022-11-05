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

    def __str__(self):
        return str(self.point)


class CustomRoute(models.Model):
    route_points = models.ManyToManyField(RoutePoint)

    def __str__(self):
        all_points = ", ".join(str(seg) for seg in self.route_points.all())
        return "{}".format(all_points)
