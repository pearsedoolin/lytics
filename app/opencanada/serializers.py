from rest_framework import serializers
from .models import City

class CitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ('pk','name')