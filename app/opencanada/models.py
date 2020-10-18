from django.db import models

housing_index_types = (
            ('H','Housing'),
            ('L','Land'),
            ('B','Both Housing and Land'),
            )

# Create your models here.
class Country(models.Model):
    name = models.CharField(max_length = 255)

class Province(models.Model):
    name = models.CharField(max_length = 255)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)

class City(models.Model):
    name = models.CharField(max_length = 255)
    province = models.ForeignKey(Province, on_delete=models.CASCADE)

class VacancyDataSixUnits(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    date = models.DateField()
    rate = models.DecimalField(max_digits = 4, decimal_places = 1)

    class Meta:
        ordering = ['date']

class VacancyDataThreeUnits(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    date = models.DateField()
    rate = models.DecimalField(max_digits = 4, decimal_places = 1)

    class Meta:
        ordering = ['date']

class HousingPriceIndex(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    date = models.DateField()
    index_value = models.DecimalField(max_digits = 5, decimal_places = 1)
    index_type = models.CharField(choices=housing_index_types,max_length=1)

    class Meta:
        ordering = ['date']

class HousingStarts(models.Model):
    province = models.ForeignKey(Province, on_delete=models.CASCADE)
    date = models.DateField()
    housing_starts = models.IntegerField()

    class Meta:
        ordering = ['date']


    
    




    

