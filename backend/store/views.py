from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
from rest_framework.permissions import AllowAny
from rest_framework.parsers import JSONParser
from django.shortcuts import render, redirect
from django.contrib import messages
from .otp_utils import verify_otp
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from .models import Product 
from .serializers import ProductSerializer

from .otp_utils import generate_otp, store_otp, verify_otp

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
        # Basic stub login logic - replace with your actual login logic
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
    def post(self, request):
        # Implement your register logic here
        pass
def verify_otp_view(request):
    email = request.session.get('verification_email')
    if not email:
        return redirect('send_otp')

    if request.method == 'POST':
        user_otp = request.POST.get('otp')
        if verify_otp(email, user_otp):
            request.session['is_verified'] = True
            request.session['email'] = email
            return redirect('main_page')
        else:
            messages.error(request, 'Invalid OTP or OTP expired')

    return render(request, 'verify_otp.html')
