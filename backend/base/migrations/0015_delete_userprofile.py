# Generated by Django 5.0.2 on 2024-05-15 12:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0014_userprofile'),
    ]

    operations = [
        migrations.DeleteModel(
            name='UserProfile',
        ),
    ]