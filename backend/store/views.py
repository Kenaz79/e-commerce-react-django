from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from .otp_utils import generate_otp, store_otp, verify_otp

def send_otp_email(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        otp = generate_otp()
        store_otp(email, otp)
        
        subject = 'Your OTP for E-commerce Login'
        message = f'Your OTP is: {otp} (Valid for 5 minutes)'
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        
        request.session['verification_email'] = email
        messages.success(request, 'OTP sent to your email!')
        return redirect('verify_otp')
    
    return render(request, 'send_otp.html')

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

def main_page(request):
    if not request.session.get('is_verified'):
        return redirect('send_otp')
    return render(request, 'main_page.html')