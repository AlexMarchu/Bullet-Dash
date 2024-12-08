from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect user data")
    
    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"],
            password=validated_data["password"],
        )
        return user
    

class ScoreSerializer(serializers.Serializer):
    username = serializers.CharField()
    score = serializers.IntegerField()
