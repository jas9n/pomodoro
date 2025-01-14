from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "password", "name"]  # Include 'name'
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        name = validated_data.pop("name", None)  # Extract the name field
        user = CustomUser.objects.create_user(**validated_data)
        if name:
            user.name = name
            user.save()
        return user
