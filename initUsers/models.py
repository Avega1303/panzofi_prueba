from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    last_session_date = models.DateTimeField()  # Fecha y hora de la última sesión
    session_time = models.IntegerField(default=0)  # Tiempo de sesión en segundos
    variableB1 = models.IntegerField(default=0)   # Variable contador1
    variableB2 = models.IntegerField(default=0)   # Variable contador2
