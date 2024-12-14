from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])

        if user is None:
            try:
                user = User.objects.create_user(
                    username=data['username'],
                    password=data['password']
                )
            except Exception as exception:
                raise serializers.ValidationError(f"Failed to create user: {str(exception)} :(")
            
        if not user.is_active:
            raise serializers.ValidationError("User is not active :(")
        return user
    

class ScoreSerializer(serializers.Serializer):
    username = serializers.CharField()
    score = serializers.IntegerField()
