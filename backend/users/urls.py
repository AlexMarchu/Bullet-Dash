from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import LoginView, ScoreView

router = DefaultRouter()
router.register(r'login', LoginView, basename='login')
router.register(r'score', ScoreView, basename="score")

urlpatterns = [
    path('', include(router.urls)),
]