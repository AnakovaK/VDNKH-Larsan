# Generated by Django 4.0.4 on 2022-11-05 10:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app_main', '0004_merge_20221105_1345'),
    ]

    operations = [
        migrations.DeleteModel(
            name='CustomRoute',
        ),
        migrations.DeleteModel(
            name='RoutePoint',
        ),
    ]