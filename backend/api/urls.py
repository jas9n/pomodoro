from django.urls import path
from .views import CreateUserView, CurrentUserView

urlpatterns = [
    path("user/register", CreateUserView.as_view(), name="create-user"),  
    path("user/", CurrentUserView.as_view(), name="current-user"),  
    
]
