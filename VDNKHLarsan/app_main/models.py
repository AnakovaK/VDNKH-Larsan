from django.db import models


class Place(models.Model):
    name = models.CharField(max_length=150, verbose_name='Название')


class Route(models.Model):
    name = models.CharField(max_length=150, verbose_name='Название')
    places = models.ManyToManyField(Place, related_name='route', verbose_name='Места')
