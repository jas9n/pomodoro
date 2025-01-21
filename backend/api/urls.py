from django.urls import path
from .views import CreateUserView, CurrentUserView, AnalyticsView

urlpatterns = [
    path("user/register", CreateUserView.as_view(), name="create-user"),  
    path("user/", CurrentUserView.as_view(), name="current-user"),  
    path("user/analytics/", AnalyticsView.as_view(), name="user-analytics"),
    
]
