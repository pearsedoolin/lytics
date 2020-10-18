import React, {useState, useEffect} from 'react';
import {MapContainer, useMapEvents, Popup} from 'react-leaflet';
import {
  Paper,
  Box,
  Grid,
  Typography,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import OverpassService from './OverpassService';
import {
  PointsWithElevation,
  PointsWithElevationController,
} from './PointsWithElevation';
import {Paths, PathsController} from './Paths';
import {MapLayer, MapLayerController} from './TileLayer';
import {DeviceMarker} from './DeviceMarker';
import {popupContent, popupHead, popupText} from './popupStyles';

const overpassService = new OverpassService();
/**
 * Gets converts the result to path
 * @param {*} result
 * @return {[]} paths array
 */
function overpassWayConverter(result) {
  const nodes = {};
  result.elements.forEach((obj) => {
    if (obj.type == 'node') {
      nodes[obj.id] = {lat: obj.lat, lon: obj.lon};
    }
  });
  const paths = {};
  let wayNodes = [];
  result.elements.forEach((obj) => {
    if (obj.type == 'way') {
      wayNodes = [];
      obj.nodes.forEach((nodeID) => {
        if (nodeID in nodes) {
          wayNodes.push([nodes[nodeID].lat, nodes[nodeID].lon]);
        }
      });
      paths[obj.id] = {nodes: wayNodes, tags: obj.tags};
    }
  });
  return paths;
}
/**
 *
 * @param {*} props
 * @return {JSX} Map component
 */
function MyMap(props) {
  // State of Map
  const [zoom, setZoom] = useState(15);
  const [mapCenter, setMapCenter] = useState([49.2, -123]);
  const [bounds, setBounds] = useState(null);

  // States of Tiles
  const [showOSM, setShowOSM] = useState(false);
  const [OSMOpacity, setOSMOpacity] = useState(50);
  const [showOTM, setShowOTM] = useState(true);
  const [OTMOpacity, setOTMOpacity] = useState(100);
  const [showElevation, setShowElevation] = useState(false);
  const [elevationOpacity, setElevationOpacity] = useState(50);

  // State of Device
  const [deviceLocation, setDeviceLocation] = useState({lat: 49, lng: -123});
  const [deviceFound, setDeviceFound] = useState(false);
  const [deviceLocationAccuracy, setDeviceLocationAccuracy] = useState(0);

  // Mountains
  const [showMountains, setShowMountains] = useState(false);
  const [minMountainElevation, setMinMountainElevation] = useState(1800);
  const [mountainPoints, setMountainPoints] = useState([]);

  // Volcanoes
  const [showVolcanoes, setShowVolcanoes] = useState(false);
  const [minVolcanoElevation, setMinVolcanoElevation] = useState(1800);
  const [volcanoPoints, setVolcanoPoints] = useState([]);

  // Bike
  const [bikePathTypes, setBikePathTypes] = useState({
    MTB: {show: false, string: 'Mountain Bike Paths', color: '#522B72'},
    Cycle: {show: false, string: 'Cycling Paths', color: '#8B66A9'},
  });

  const [bikePaths, setBikePaths] = useState({});

  // Alerts
  const [dataSizeWarnings, setDataSizeWarnings] = useState({
    Mountains: '',
    Volcanoes: '',
    Hiking: '',
    Biking: '',
  });

  const dataSizeMessage = 'data is too large, try zooming in to' +
  ' decrease the amount of data that will be shown.';

  // Hiking
  const [hikingPathTypes, setHikingPathTypes] = useState({
    hiking: {show: false, string: 'Hiking', color: '#fab385'},
    mountain_hiking: {show: false, string: 'Mountain Hiking', color: '#f89454'},
    demanding_mountain_hiking: {show: false,
      string: 'Demanding Mountain Hiking',
      color: '#f67523'},
    alpine_hiking: {show: false, string: 'Alpine Hiking', color: '#dc5c09'},
    demanding_alpine_hiking: {show: false,
      string: 'Demanding Alpine Hiking',
      color: 'ab4707'},
    difficult_alpine_hiking: {show: false,
      string: 'Difficult Alpine Hiking', color: '#7a3305'},
    no_sac_scale: {show: false, string: 'No SAC scale', color: '#491f03'},
  });

  const [highlightedPathID, setHighlightedPathID] = useState(0);

  // InfoPopup
  const [showPopup, setShowPopup] = useState(false);
  const [popupTags, setPopupTags] = useState({});
  const [popupType, setPopupType] = useState('');
  const [popupTitle, setPopupTitle] = useState('Popup Title');
  const [popupLocation, setPopupLocation] = useState({lat: 49, lng: -123});
  const [hikingPaths, setHikingPaths] = useState({});
  /**
 *
 * @param {obj} result The result from overpass
 * @param {str} dataName The name of the data, ie. Mountains
 * @return {bool} True if maxSize not exceeded
 */
  function checkMaxSize(result, dataName) {
    if ('remark' in result &&
    result.remark.includes('runtime error: Query ran out of memory')) {
      var message = dataName + ' ' + dataSizeMessage;
      var ret = false;
    } else {
      var message = '';
      var ret = true;
    }
    setDataSizeWarnings((prevState) => {
      prevState[dataName] = message;
      return prevState;
    });
    return ret;
  }

  /**
 *
 */
  function updateMountains() {
    if (bounds === null || !showMountains) return;
    overpassService.getMountains(bounds, minMountainElevation).then((result) => {
      if (checkMaxSize(result, 'Mountains')) {
        setMountainPoints(result.elements);
      } else {
        setMountainPoints([]);
      }
    });
  }
  /**
 *
 */
  function updateVolcanoes() {
    if (bounds === null || !showVolcanoes) return;
    overpassService.getVolcanoes(bounds, bounds.minVolcanoElevation).then((result) => {
      if (checkMaxSize(result, 'Volcanoes')) {
        setVolcanoPoints(result.elements);
      } else {
        setVolcanoPoints([]);
      }
    });
  }
  /**
 *
 */
  function updateBikePaths() {
    if (Object.values(bikePathTypes).some((val) => val.show) && bounds !== null) {
      overpassService.getBikePaths(bounds, bikePathTypes).then((result) => {
        if (checkMaxSize(result, 'Biking')) {
          const paths = overpassWayConverter(result);
          setBikePaths(paths);
        } else {
          setBikePaths({});
        }
      }).catch((error) => console.log(error));
    } else {
      setBikePaths({});
    }
  }
  /**
 *
 */
  function updateHikingPaths() {
    if (Object.values(hikingPathTypes).some((val) => val.show) && bounds !== null) {
      overpassService.getHikingPaths(bounds, hikingPathTypes).then((result) => {
        if (checkMaxSize(result, 'Hiking')) {
          const paths = overpassWayConverter(result);
          setHikingPaths(paths);
        } else {
          setHikingPaths({});
        }
      });
    } else {
      // console.log("No Hiking Paths selected");
      setHikingPaths({});
    }
  }

  return (
    <>
      <MapContainer zoom={zoom} center={mapCenter}
        style={{width: '100%', height: '60vh'}}>
        <MapEventHandler setZoom={setZoom}
          bounds={bounds}
          setBounds={setBounds}
          updateMountains={updateMountains}
          showMountains={showMountains}
          updateVolcanoes={updateVolcanoes}
          showVolcanoes={showVolcanoes}
          updateHikingPaths={updateHikingPaths}
          updateBikePaths={updateBikePaths} />
        <DeviceMarker setDeviceLocation={setDeviceLocation}
          deviceLocation={deviceLocation}
          setMapCenter={setMapCenter}
          setDeviceLocationAccuracy={setDeviceLocationAccuracy}
          setDeviceFound={setDeviceFound}
          deviceLocationAccuracy={deviceLocationAccuracy}
          setShowPopup={setShowPopup}
          setPopupTags={setPopupTags} />
        <MapLayer
          attribution='<a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={OSMOpacity / 100}
          show={showOSM} />
        <MapLayer
          attribution='<a href="https://www.mapzen.com/terms/">OpenTopoMap</a>'
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" opacity={OTMOpacity / 100}
          show={showOTM} />
        <MapLayer
          attribution='<a href="https://www.mapzen.com/rights">Mapzen</a>'
          url="https://s3.amazonaws.com/elevation-tiles-prod/normal/{z}/{x}/{y}.png" opacity={elevationOpacity / 100}
          show={showElevation} />
        <PointsWithElevation color={'grey'}
          show={showMountains}
          points={mountainPoints}
          setShowPopup={setShowPopup}
          setPopupLocation={setPopupLocation}
          setPopupTitle={setPopupTitle}
          setPopupTags={setPopupTags} />
        <PointsWithElevation color={'red'}
          show={showVolcanoes}
          points={volcanoPoints}
          setShowPopup={setShowPopup}
          setPopupLocation={setPopupLocation}
          setPopupTitle={setPopupTitle}
          setPopupTags={setPopupTags} />
        <Paths key={1} paths={hikingPaths} pathTypes={hikingPathTypes}
          setShowPopup={setShowPopup}
          setPopupLocation={setPopupLocation}
          setPopupTitle={setPopupTitle}
          setPopupTags={setPopupTags}
          setHighlightedPathID={setHighlightedPathID}
          highlightedPathID={highlightedPathID} />
        <Paths key={2} paths={bikePaths} pathTypes={bikePathTypes}
          setShowPopup={setShowPopup}
          setPopupLocation={setPopupLocation}
          setPopupTitle={setPopupTitle}
          setPopupTags={setPopupTags}
          setHighlightedPathID={setHighlightedPathID}
          highlightedPathID={highlightedPathID} />
        <InfoPopup show={showPopup} setShow={setShowPopup}
          tags={popupTags} title={popupTitle} location={popupLocation} />
      </MapContainer>
      <Box mt={2}>
        {Object.keys(dataSizeWarnings).map((key) => {
          if (dataSizeWarnings[key] == '') {
            return null;
          } else {
            return (
              <Alert key={key} variant="outlined" severity="warning">
                {dataSizeWarnings[key]}
              </Alert>
            );
          }
        })}
      </Box>
      <Box mt={3}>
        <Paper elevation={3}>
          <Grid container spacing={3}>
            <Grid item md={4} sm={6} xs={12}>
              <MapLayerController title={'OpenTopoMaps'}
                opacity={OTMOpacity}
                setOpacity={setOTMOpacity}
                showLayer={showOTM}
                setShowLayer={setShowOTM}
                zoom={zoom}
                maxZoom={17} />
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <MapLayerController title={'OpenStreetMaps'}
                opacity={OSMOpacity}
                setOpacity={setOSMOpacity}
                showLayer={showOSM}
                setShowLayer={setShowOSM}
                zoom={zoom}
                maxZoom={19} />
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <MapLayerController title={'Elevation'}
                opacity={elevationOpacity}
                setOpacity={setElevationOpacity}
                showLayer={showElevation}
                setShowLayer={setShowElevation}
                zoom={zoom}
                maxZoom={15} />
            </Grid>
          </Grid>
        </Paper>
        <Paper>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <PointsWithElevationController title={'Mountains'}
                setShow={setShowMountains}
                show={showMountains}
                setMinElevation={setMinMountainElevation}
                minElevation={minMountainElevation}
                updatePoints={updateMountains} />
            </Grid>
            <Grid item xs={6}>
              <PointsWithElevationController title={'Volcanoes'}
                setShow={setShowVolcanoes}
                show={showVolcanoes}
                setMinElevation={setMinVolcanoElevation}
                minElevation={minVolcanoElevation}
                updatePoints={updateVolcanoes} />
            </Grid>
          </Grid>
        </Paper>

        <Paper>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <PathsController
                title={'Hiking Paths'}
                pathTypes={hikingPathTypes}
                setPathTypes={setHikingPathTypes}
                updatePaths={updateHikingPaths}
                bounds={bounds}
                note={'These trail catagories are from' +
                ' the openstreetmap\'s sac_scale'} />
            </Grid>
            <Grid item xs={6}>
              <PathsController
                title={'Bike Paths'}
                pathTypes={bikePathTypes}
                setPathTypes={setBikePathTypes}
                updatePaths={updateBikePaths}
                bounds={bounds} />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
}
/**
 *
 * @param {*} props
 */
function InfoPopup(props) {
  if (!props.show) {
    return null;
  } else {
    // console.log("rerending")
    let noinfo = true;
    let content =
            Object.keys(props.tags).map((key) => {
              if (!(['name', 'sac_scale', 'highway', 'natural']).includes(key) &&
              key.match(/^name:/g) == null) {
                noinfo = false;
                let parsedKey = key.replace(/[:_]/g, ' ');
                let units = '';
                if (parsedKey === 'ele') {
                  parsedKey = 'elevation';
                  units = 'm';
                }
                return <Typography key={key}>
                  <b>{parsedKey}:&nbsp;</b>
                  {props.tags[key]} {units}
                </Typography>;
              }
            });
    if (noinfo) {
      content = <Typography>No Info</Typography>;
    }
    return (
      <Popup className="request-popup" position={props.location}
        eventHandlers={{
          close() {
            props.setShowPopup(false);
          },
        }}
        // onClose={() => { props.setShow(false); }}
      >
        <div style={popupContent}>
          <div style={popupHead}>
            {props.title}
          </div>
          <span style={popupText}>
            {content}
          </span>
        </div>
      </Popup>
    );
  }
}
/**
 *
 * @param {*} props
 */
function MapEventHandler(props) {
  useEffect(() => {
    // console.log("bounds", props.bounds)
    props.updateMountains();
    props.updateVolcanoes();
    props.updateHikingPaths();
    props.updateBikePaths();
  }, [props.bounds]);

  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      props.setBounds(bounds);
      props.setZoom(map.getZoom());
      // console.log("move end");
    },
  });
  return null;
}

export default MyMap;
