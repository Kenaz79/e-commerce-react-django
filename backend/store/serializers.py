from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')  # Remove before user creation
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        extra_kwargs = {
            'image': {'required': False},  # Make image optional
            'image_url': {'required': False},  # Make image_url optional
        }
        
        read_only_fields = ['rating', 'reviews', 'created_at', 'updated_at', 'in_stock']
        
    
    def create(self, validated_data):
        # Handle image_url vs image field
        if 'image_url' in validated_data and validated_data['image_url']:
            # If image_url is provided, use it
            pass
        return super().create(validated_data)