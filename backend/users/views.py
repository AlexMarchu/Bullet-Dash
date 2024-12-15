from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .serializers import LoginSerializer, ScoreSerializer

User = get_user_model()

class LoginView(viewsets.ViewSet):

    serializer_class = LoginSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        if isinstance(user, dict):
            user = serializer.save()

        refresh_token = RefreshToken.for_user(user)

        return Response({
            "status": "Login succesfull",
            "token": str(refresh_token.access_token),
        })
    

class ScoreView(viewsets.ViewSet):

    serializer_class = ScoreSerializer

    @action(detail=False, methods=["post"])
    def update_score(self, request):
        username = request.data.get("username")
        user = User.objects.get(username=username)
        user.score = max(user.score, request.data.get("score"))
        user.save()
        return Response({"status": "Score updated"})
    
    @action(detail=False, methods=["get"])
    def get_score(self, request):
        username = request.data.get("username")
        user = User.objects.get(username=username)
        return Response({"score": user.score})
    
    @action(detail=False, methods=["get"])
    def get_users_scores(self, request):
        users = User.objects.all()
        scores = list({"username": user.username, "score": user.score} for user in users)
        return Response(scores)
