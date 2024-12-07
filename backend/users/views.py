from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response

from serializers import LoginSerializer


class LoginView(viewsets.ViewSet):
    serializer_class = LoginSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        return Response({"message": "Login succesfull"})
