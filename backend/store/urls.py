from django.urls import path
from .views import (
    LoginView, ProductListView, RegisterView, SendOTPView,
    VerifyOTPView, main_page
)

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('send-otp/', SendOTPView.as_view(), name='send_otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),  # ✅ FIXED
    path('main/', main_page, name='main_page'),
]
