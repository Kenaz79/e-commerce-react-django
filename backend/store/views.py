from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
from .serializers import RegisterSerializer, ProductSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.parsers import JSONParser
from django.shortcuts import render, redirect
from django.contrib import messages
from .otp_utils import generate_otp, store_otp, verify_otp
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from .models import Product 

def main_page(request):
    if not request.session.get('is_verified'):
        return redirect('send_otp')
    return render(request, 'main_page.html')


class ProductListView(APIView):
    # For GET requests - anyone can view products
    # For POST requests - only authenticated admin users can create products
    permission_classes = [AllowAny]  # Or [IsAuthenticated] for POST only
     
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        # Check if user is authenticated (optional)
        #if not request.user.is_authenticated:
            #return Response(
                #{'error': 'Authentication required to create products'},
                #status=status.HTTP_401_UNAUTHORIZED
            #)
        
        # Check if user is staff/admin (optional but recommended)
        #if not request.user.is_staff:
            #return Response(
                #{'error': 'Only admin users can create products'},
                #status=status.HTTP_403_FORBIDDEN
            #)

        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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