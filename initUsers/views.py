import json
from django.shortcuts import redirect
from django.http import JsonResponse
from rest_framework import viewsets
from .models import UserProfile
from .serializers import UserProfileSerializer
from django.contrib.auth import login, logout, authenticate
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from datetime import date
from datetime import datetime

class UserProfileListView(viewsets.ModelViewSet):

    # Serializar los perfiles de usuario
    serializer_class = UserProfileSerializer
    # Perfiles de usuario
    queryset = UserProfile.objects.all()


#@csrf_protect  # Exige el token CSRF
@csrf_exempt  # Exime solicitudel token CSRF

def login_view(request):

    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            is_superuser = user.is_superuser
            return JsonResponse({'message': 'Autenticado correctamente','is_superuser':is_superuser}, status=200)
        else:
            return JsonResponse({'error': 'Usuario o contraseña incorrectos'}, status=400)
        
    return JsonResponse({'error': 'Método no permitido'}, status=405)

def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'redirect_to': '/'}, status=200)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

def clickcount(request, button_id):

    user_profile = UserProfile.objects.get(user=request.user)
    if button_id == 1:
        user_profile.variableB1 += 1  # Incrementar el contador del primer botón
    elif button_id == 2:
        user_profile.variableB2 += 1  # Incrementar el contador del segundo botón

    user_profile.save()
    return JsonResponse({'message': 'Contador actualizado correctamente'}, status=200)

def updatesession(request):

    user_profile = UserProfile.objects.get(user=request.user)
    today = date.today()

    # Verificar si la fecha actual es igual a la fecha guardada
    if user_profile.last_session_date.date() != today:
        user_profile.last_session_date = today
        user_profile.save()
        message = 'Fecha de sesión actualizada correctamente.'
    else:
        message = 'Ya has ingresado hoy.'

    return JsonResponse({'message': message})

def updatetime(request):

    if request.method == 'POST':

        data = json.loads(request.body)
        session_time = data.get('session_time') 

        user_profile = UserProfile.objects.get(user=request.user)

        # Actualizar el tiempo de sesión
        user_profile.session_time = session_time  
        user_profile.save()

        return JsonResponse({'message': 'Tiempo de sesión guardado correctamente'}, status=200)
    
    return JsonResponse({'error': 'Método no permitido'}, status=405)

