# Generated by Django 4.0.4 on 2022-11-04 20:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_main', '0002_alter_place_id_alter_route_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='route',
            name='detail_text',
            field=models.TextField(blank=True),
        ),
    ]