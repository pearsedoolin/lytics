
# Register your models here.
from django.contrib import admin

from .models import Country, Province, City, VacancyDataSixUnits

admin.site.register(Country)
admin.site.register(Province)
admin.site.register(City)
admin.site.register(VacancyDataSixUnits)
