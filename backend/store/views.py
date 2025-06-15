from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
from rest_framework.permissions import AllowAny
from rest_framework.parsers import JSONParser
from django.shortcuts import render, redirect
from django.contrib import messages
from .otp_utils import generate_otp, store_otp, verify_otp
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from .models import Product 
from .serializers import ProductSerializer

def main_page(request):
    if not request.session.get('is_verified'):
        return redirect('send_otp')
    return render(request, 'main_page.html')


class ProductListView(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


class LoginView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]

    def post(self, request):
        return Response({"message": "Login successful"}, status=status.HTTP_200_OK)


class SendOTPView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        otp = generate_otp()
        store_otp(email, otp)

        subject = 'Your OTP for E-commerce Login'
        message = f'Your OTP is: {otp} (Valid for 5 minutes)'
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
        except Exception as e:
            return Response({'error': 'Failed to send email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'OTP sent to your email!'}, status=status.HTTP_200_OK)


class RegisterView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response({'error': 'Username, email, and password are required.'},
                            status=status.HTTP_400_BAD_REQUEST)
        
        try:
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
            if User.objects.filter(email=email).exists():
                return Response({'error': 'Email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            user.save()

            return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': 'Registration failed. ' + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            return Response({'error': 'Email and OTP are required.'},
                            status=status.HTTP_400_BAD_REQUEST)

        if verify_otp(email, otp):
            request.session['is_verified'] = True
            request.session['email'] = email
            return Response({'message': 'OTP verified successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid or expired OTP.'}, status=status.HTTP_400_BAD_REQUEST)
