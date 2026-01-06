from rest_framework import serializers
from .models import Product, Order, Deliverer

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

class DelivererSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deliverer
        fields = '__all__'