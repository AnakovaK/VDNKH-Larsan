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

# class Profile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', verbose_name='Пользователь')
#     patronymic = models.CharField(max_length=55, verbose_name='Отчество')
#     born = models.DateField(verbose_name='Дата рождения')
#
#     @property
#     def first_name(self):
#         return self.user.first_name
#
#     @property
#     def last_name(self):
#         return self.user.last_name
#
#     @property
#     def age(self):
#         from datetime import date
#         today = date.today()
#         return today.year - self.born.year - ((today.month, today.day) < (self.born.month, self.born.day))
#
#     def __str__(self):
#         return self.first_name + " " + self.last_name + " " + self.patronymic
