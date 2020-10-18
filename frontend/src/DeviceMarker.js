import React, { useEffect} from 'react';
import { Circle, Marker, useMapEvents } from 'react-leaflet'
import { Icon, Point } from 'leaflet';
import locationIcon from './locationIcon.png';

export function DeviceMarker(props) {
    var options = {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 5000
      };

    useEffect(() => {
        map.locate(options);
        const interval = setInterval(() => {
        //   console.log('This will run every 60 seconds!');
          map.locate(options);
        }, 10000);
        return () => clearInterval(interval);
      }, []);

    const map = useMapEvents({
        locationfound: (loc) => {
            console.log("location found: ", loc)
            props.setDeviceLocation(Object.values(loc.latlng));
            props.setDeviceLocationAccuracy(loc.accuracy);
            props.setDeviceFound(prev => {
                if (!prev) { map.panTo(loc.latlng); }
                return true
            });
        },
        locationerror: (err) => {
            console.log("Error finding location: ", err);
        }
    })

    return (
        <>
            <Circle center={props.deviceLocation} radius={props.deviceLocationAccuracy} />;
            <Marker position={props.deviceLocation}
                icon={
                    new Icon({
                        iconUrl: locationIcon,
                        iconAnchor: new Point(10, 15),
                        iconSize: [20, 30],
                        shadowSize: [5, 10],
                        iconAnchor: [10, 30],
                    })
                }
            ></Marker>
        </>
    )
}