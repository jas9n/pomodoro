from django.urls import path
from .views import CreateUserView, CurrentUserView

urlpatterns = [
    path("users/", CreateUserView.as_view(), name="create-user"),
    path('api/user/', CurrentUserView.as_view(), name='current-user'),
]
