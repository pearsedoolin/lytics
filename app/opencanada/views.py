from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import VacancyDataSixUnits
from .models import City
from .serializers import *
from django.http import Http404
from django.db.models import Count
import datetime

# Get list of cities with vacancy data.
@api_view(['GET'])
def vacancy_cities_six_units(request):
    """
    List  cities.
    """
    if request.method == 'GET':
        cities = City.objects.annotate(
            nchild=Count('vacancydatasixunits')
        ).filter(nchild__gt=0)
        # serializer = VacancyCitiesSerializer(cities,context={'request': request},many=True)
        print(cities)
        serializer = CitiesSerializer(cities, context={'request': request} ,many=True)
        return Response({'cities': serializer.data })

@api_view(['GET'])
def vacancy_data_six_units(request, city):
    """
    Get date, rate data for the requested city.
    """
    if request.method == 'GET':
        vacancy_data = VacancyDataSixUnits.objects.filter(city__name = city).order_by('date')

        dates = vacancy_data.values_list('date', flat=True)
        days_since_jan1_0001 = []
        t0 = datetime.date(1, 1, 1)
        for i, date in enumerate(dates):
            print(date)
            days_since_jan1_0001.append((date - t0).days)

        print(days_since_jan1_0001)
        data = vacancy_data.values_list('rate', flat=True)
        name = city + " Vacancy Data Six Units"
        if not dates:
            raise Http404

            
        # serializer = VacancyCitiesSerializer(cities,context={'request': request},many=True)

        return Response({'name': name, 'dates': days_since_jan1_0001, 'data': data})