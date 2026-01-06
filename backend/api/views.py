from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Product, Order, Deliverer
from .serializers import ProductSerializer, OrderSerializer, DelivererSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    
    def create(self, request):
        # Generate order number
        import uuid
        request.data['order_number'] = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        return super().create(request)

class DelivererViewSet(viewsets.ModelViewSet):
    queryset = Deliverer.objects.all()
    serializer_class = DelivererSerializer
    
    @action(detail=False, methods=['post'])
    def admin(self, request):
        # Handle admin deliverer creation
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)