def validate_file_extension(value):
    import os
    from django.core.exceptions import ValidationError
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ('.json',)
    if not ext.lower() in valid_extensions:
        raise ValidationError('Данный тип файла не поддерживается. Загрузите JSON-файл.')
