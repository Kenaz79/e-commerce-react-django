import random
from django.core.cache import cache
from django.conf import settings

def generate_otp():
    return str(random.randint(100000, 999999))

def store_otp(email, otp):
    # Store OTP in cache with expiration time
    cache.set(f'otp_{email}', otp, timeout=settings.OTP_VALIDITY)
    return otp

def verify_otp(email, user_otp):
    stored_otp = cache.get(f'otp_{email}')
    return stored_otp == user_otp