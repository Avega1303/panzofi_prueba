from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):

    username = serializers.CharField(source='user.username')
    last_session_date = serializers.DateTimeField()
    session_time = serializers.IntegerField()
    variableB1 = serializers.IntegerField()
    variableB2 = serializers.IntegerField()

    class Meta:
        model = UserProfile
        fields = ['username', 'last_session_date', 'session_time', 'variableB1', 'variableB2'] 