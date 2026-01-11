from django.db import models

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('Electronics', 'Electronics'),
        ('Fashion', 'Fashion'),
        ('Home & Garden', 'Home & Garden'),
        ('Beauty', 'Beauty'),
        ('Sports', 'Sports'),
        ('Books', 'Books'),
        ('Toys', 'Toys'),
        ('Food', 'Food'),
        ('Health', 'Health'),
    ]
    
    BRAND_CHOICES = [
        ('Apple', 'Apple'),
        ('Samsung', 'Samsung'),
        ('Nike', 'Nike'),
        ('Adidas', 'Adidas'),
        ('Sony', 'Sony'),
        ('LG', 'LG'),
        ('Philips', 'Philips'),
        ('Bosch', 'Bosch'),
        ('Generic', 'Generic'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Electronics')
    brand = models.CharField(max_length=50, choices=BRAND_CHOICES, default='Generic')
    stock = models.IntegerField(default=0)
    in_stock = models.BooleanField(default=True)
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True) # Add this for external URLs
    rating = models.FloatField(default=0.0)
    reviews = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # Automatically update in_stock based on stock quantity
        self.in_stock = self.stock > 0
        super().save(*args, **kwargs)