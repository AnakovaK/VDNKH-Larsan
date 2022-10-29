from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from taggit.managers import TaggableManager

class Visitor(models.Model):
    """
    Модель посетителя выставки, добавляющая больше функций и параметров к базовому классу User.

    :param user: Пользователь, к которому относится модель покупателя/персонала.
    :type user: :class:`~User`
    :param name: Имя посетителя
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    tags = TaggableManager()

    @receiver(post_save, sender=User)
    def create_customer_from_user(sender, instance, created, **kwargs):
        """
        Метод создания посетителя сразу после того, как пользователь (User) регистрируется на сайте.
        """
        if created:
            Visitor.objects.create(user=instance)

    @receiver(post_save, sender=User)
    def save_visitor(sender, instance, **kwargs):
        """
        Метод работает в паре с методом создания посетителя. Сохраняет в базе данных "посетителя".
        """
        instance.visitor.save()

    def get_tags(self):
        return self.tags
