from django.urls import path
from . import views
from .views import LoginView, ProductListView, RegisterView

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
      path('send-otp/', views.send_otp_email, name='send_otp'),
    path('verify-otp/', views.verify_otp_view, name='verify_otp'),
    path('main/', views.main_page, name='main_page'),
]
