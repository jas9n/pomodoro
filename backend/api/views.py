from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics
from .models import CustomUser
from .serializers import UserSerializer
from datetime import date


class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "name": getattr(user, 'name', user.username),  
            "preferences": user.preferences,
        })
    
    def put(self, request):
        user = request.user
        preferences = request.data.get('preferences')

        if preferences and isinstance(preferences, dict):
            timers = preferences.get('timers')
            sound = preferences.get('sound')
            theme = preferences.get('theme')
            display_greeting = preferences.get('displayGreeting')
            clock_font = preferences.get('clockFont')  

            if timers and isinstance(timers, dict):
                user.preferences['timers'] = timers

            if sound and isinstance(sound, dict):
                user.preferences['sound'] = sound

            if theme and isinstance(theme, str):
                user.preferences['theme'] = theme
                
            if display_greeting is not None:
                user.preferences['displayGreeting'] = display_greeting
                
            if clock_font and isinstance(clock_font, str):
                user.preferences['clockFont'] = clock_font

            user.save()

            return Response({
                "message": "Preferences updated successfully.",
                "preferences": user.preferences,
            }, status=200)

        return Response({
            "message": "Invalid preferences data."
        }, status=400)


class AnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        study_time = user.study_time 
        days_logged = len(user.days_logged)  

        return Response({
            "study_time": study_time,
            "days_logged": days_logged,
        })

    def post(self, request):
        user = request.user

        study_time = request.data.get("study_time", 0)
        if isinstance(study_time, int) and study_time > 0:
            user.study_time += study_time

        today = str(date.today())
        if today not in user.days_logged:
            user.days_logged.append(today)

        user.save()

        return Response({
            "message": "Analytics updated successfully.",
            "study_time": user.study_time,
            "days_logged": len(user.days_logged),
        }, status=200)
