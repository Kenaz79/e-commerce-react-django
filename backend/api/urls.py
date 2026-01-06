from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'products', views.ProductViewSet)
router.register(r'orders', views.OrderViewSet)
router.register(r'deliverers', views.DelivererViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Special endpoint for admin deliverers
    path('admin/deliverers/', views.DelivererViewSet.as_view({'post': 'admin'}), name='admin-deliverers'),
]