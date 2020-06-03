from django.db import models

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

# HOUSING_TYPE_CHOICES = ( 
#     ("Apt", "Aparment"),
#     ("Sng", "Single Detached") 
# ) 

# class HousingStartData(models.Model):
#     starts = models.PositiveIntegerField()
#     province = models.ForeignKey(Province, on_delete=models.CASCADE)
#     date = models.DateField()


#     housing_start_type = models.CharField(
#         choices=HOUSING_TYPE_CHOICES,
#          max_length = 4
#          )

    
    




    

