from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class SignUpForm(UserCreationForm):
    patronymic = forms.TextInput()
    is_moscowian = forms.CheckboxInput()

    class Meta:
        model = User
        fields = ('username', 'password1', 'password2', 'first_name', 'last_name', 'email')


class WalkRequirementsForm(forms.Form):
    WALKING = (
        ('f', 'быстрая'),
        ('s', 'размеренная'),
        ('i', 'только самое интересное'),
    )
    MONEY = (
        ('f', 'бесплатно'),
        ('p', 'можно платно'),
        ('d', 'без разницы'),
    )
    MOVEMENT = (
        ('f', 'пешком'),
        ('e', 'на электробусах'),
        ('d', 'без разницы'),
    )

    type_of_walking = forms.ChoiceField(choices=WALKING)
    money = forms.ChoiceField(choices=MONEY)
    movement = forms.ChoiceField(choices=MOVEMENT)
