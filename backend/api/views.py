from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics
from .models import CustomUser
from .serializers import UserSerializer
from datetime import date
import logging

logger = logging.getLogger(__name__)

class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        logger.info(f"Incoming payload: {request.data}")  # Log payload
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            logger.info(f"User created: {user}")  # Log user details
            return Response(serializer.data, status=201)
        logger.warning(f"Validation errors: {serializer.errors}")  # Log validation errors
        return Response(serializer.errors, status=400)



class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logger.info(f"GET /api/user/current - User: {request.user}")  # Log the authenticated user
        user = request.user
        return Response({
            "username": user.username,
            "name": getattr(user, 'name', user.username),  
            "preferences": user.preferences,
        })

    def put(self, request):
        logger.info(f"PUT /api/user/current - User: {request.user}")  # Log user
        logger.info(f"Preferences payload: {request.data}")  # Log incoming preferences

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
            logger.info(f"Updated preferences: {user.preferences}")  # Log updated preferences

            return Response({
                "message": "Preferences updated successfully.",
                "preferences": user.preferences,
            }, status=200)

        logger.warning("Invalid preferences data.")
        return Response({
            "message": "Invalid preferences data."
        }, status=400)


class AnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logger.info(f"GET /api/analytics - User: {request.user}")  # Log user
        user = request.user

        study_time = user.study_time
        days_logged = len(user.days_logged)

        logger.info(f"Analytics data: study_time={study_time}, days_logged={days_logged}")  # Log analytics
        return Response({
            "study_time": study_time,
            "days_logged": days_logged,
        })

    def post(self, request):
        logger.info(f"POST /api/analytics - User: {request.user}")  # Log user
        logger.info(f"Analytics payload: {request.data}")  # Log incoming analytics payload

        user = request.user

        study_time = request.data.get("study_time", 0)
        if isinstance(study_time, int) and study_time > 0:
            user.study_time += study_time

        today = str(date.today())
        if today not in user.days_logged:
            user.days_logged.append(today)

        user.save()

        logger.info(f"Updated analytics: study_time={user.study_time}, days_logged={len(user.days_logged)}")  # Log updates
        return Response({
            "message": "Analytics updated successfully.",
            "study_time": user.study_time,
            "days_logged": len(user.days_logged),
        }, status=200)


class CheckUsernameView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        username = request.query_params.get("username")
        if not username:
            return Response({"error": "Username is required."}, status=400)

        exists = CustomUser.objects.filter(username=username).exists()
        return Response({"exists": exists}, status=200)