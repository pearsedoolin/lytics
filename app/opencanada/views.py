from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import City, Province, VacancyDataSixUnits, HousingStarts, HousingPriceIndex
from .serializers import *
from django.http import Http404
from django.db.models import Count
import datetime

#Get list of data names (ie cities, or stock tickers).
@api_view(['GET'])
def get_data_names(request, data_type):
    """
    List  cities.

    Valid data_types are vacancydatasixunits, ...
    """
    if request.method == 'GET':
        if data_type == 'vacancydatasixunits':
            # print('getting data names')
            data_parent = City
            data_child = VacancyDataSixUnits
            data_names = data_parent.objects.annotate( nchild=Count(data_type)).filter(nchild__gt=0)

        if data_type == 'housingstarts':
            data_parent = Province
            data_child = HousingStarts
            data_names = data_parent.objects.annotate( nchild=Count(data_type)).filter(nchild__gt=0)

        if data_type == 'housingpriceindex':
            data_parent = City
            data_child = HousingPriceIndex
            data_names = data_parent.objects.annotate( nchild=Count(data_type)).filter(nchild__gt=0)

        serializer = CitiesSerializer(data_names, context={'request': request}, many=True)
        return Response({'dataNames': serializer.data })

@api_view(['GET'])
def get_data(request, data_type, data_name):
    """
    Get data.

    data type would be something like vacancydatasixunits and data_name could be vancouver.

    """
    if request.method == 'GET':
        if data_type == 'vacancydatasixunits':
            data_objects = VacancyDataSixUnits.objects.filter(city__name = data_name).order_by('date')
            data = data_objects.values_list('rate', flat=True)

        if data_type == 'housingstarts':
            data_objects = HousingStarts.objects.filter(province__name = data_name).order_by('date')
            data = data_objects.values_list('housing_starts', flat=True)

        if data_type == 'housingpriceindex':
            data_objects = HousingPriceIndex.objects.filter(city__name = data_name, index_type = 'H').order_by('date')
            data = data_objects.values_list('index_value', flat=True)
            
        dates = data_objects.values_list('date', flat=True)
        days_since_jan1_0001 = []
        t0 = datetime.date(1, 1, 1)
        for i, date in enumerate(dates):
            print(date)
            days_since_jan1_0001.append((date - t0).days)

        if not dates:
            raise Http404

            
        # serializer = VacancyCitiesSerializer(cities,context={'request': request},many=True)

        return Response({'data_name': data_name, 'data_type': data_type, 'dates': days_since_jan1_0001, 'data': data})