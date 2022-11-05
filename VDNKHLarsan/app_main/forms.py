from django import forms
from .validators import validate_file_extension


class UploadForm(forms.Form):
    json_file = forms.FileField(validators=[validate_file_extension])
