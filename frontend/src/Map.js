import React, { Component } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import { popupContent, popupHead, popupText } from "./popupStyles";

import theme from './theme'
import { Paper, Box } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import OverpassService from './OverpassService';
import { Map, Polyline, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { red } from '@material-ui/core/colors';
import "./Map.css";

const VolcanoSwitch = withStyles({
  switchBase: {
    '&$checked': {
      color: red[500],
    },
    '&$checked + $track': {
      backgroundColor: red[500],
    },
  },
  checked: {},
})(Switch);

const overpassService = new OverpassService();

class MyMap extends Component {
  constructor(props) {
    super(props);

    this.sacScale = ['hiking',
      'mountain_hiking',
      'demanding_mountain_hiking',
      'alpine_hiking',
      'demanding_alpine_hiking',
      'difficult_alpine_hiking'
    ]

    this.cycleRoutesColour = "#522B72";
    this.MTBRoutesColour = "#8B66A9";

    let showSacScale = {};
    this.sacScale.forEach((sac) => {
      showSacScale[sac] = false;
    })

    this.pathColours = ["#fab385", "#f89454", "#f67523", "#dc5c09", "#ab4707", "#7a3305", "#491f03"];

    this.state = {
      lat: 49.782063,
      lng: -123.241777,
      zoom: 13,
      openTopoOpacity: 25,
      openStreetOpacity: 25,
      elevationTileOpacity: 25,
      bounds: {},
      geoJSON: {},

      mountains: [],
      showMountains: false,
      minMountainElevation: 1800,

      volcanoes: [],
      showVolcanoes: false,
      minVolcanoElevation: 1800,

      paths: {},
      showSacScale: showSacScale,
      showNoSacScale: false,

      showPopup: false,
      popupContent: {},
      popupLocation: [49, -123],

      showCycleRoutes: false,
      showMTBRoutes: false,
      MTBRoutes: {},
      cycleRoutes: {},

      showRightClickPopup: false,
      rightClickPopupLocation: [49, -123],
      rightClickPopupElevation: "",
      rightClickPopupContent: {},

      showOpenStreetTiles: true,
      showOpenTopoTiles: true,
      showElevationTiles: true,
    };
  }

  componentDidMount() {
    this.handleMapChange();
  }

  overpassWayConverter = (result) => {
    var nodes = {};
    result.elements.forEach((obj) => {
      if (obj.type == "node") {
        nodes[obj.id] = { lat: obj.lat, lon: obj.lon };
      }
    });

    var paths = {};
    var wayNodes = [];

    result.elements.forEach((obj) => {
      if (obj.type == "way") {
        wayNodes = [];
        obj.nodes.forEach((node_id) => {
          if (node_id in nodes) {
            wayNodes.push([nodes[node_id].lat, nodes[node_id].lon]);
          }
        })
        paths[obj.id] = { nodes: wayNodes, tags: obj.tags, };
      }
    });
    return paths;
  }

  handleMapChange = () => {
    let bounds = this.refs.map.leafletElement.getBounds();
    if (this.state.showMountains) {
      overpassService.getMountains(bounds, this.state.minMountainElevation).then(result => {
        this.setState(() => {
          return { bounds: bounds, mountains: result.elements };
        })
      });
    }
    if (this.state.showVolcanoes) {
      overpassService.getVolcanoes(bounds, this.state.minVolcanoElevation).then(result => {
        this.setState(() => {
          // console.log("volcanoes result: ", result);
          return { bounds: bounds, volcanoes: result.elements };
        })
      });
    }

    if (Object.values(this.state.showSacScale).some((val) => (val)) || this.state.showNoSacScale) {
      overpassService.getPaths(bounds, this.state.showSacScale, this.state.showNoSacScale).then(result => {
        let paths = this.overpassWayConverter(result);
        this.setState(() => {
          return { bounds: bounds, paths: paths };
        })
      });
    }

    if (this.state.showCycleRoutes) {
      overpassService.getCycleRoutes(bounds).then(result => {
        let paths = this.overpassWayConverter(result);
        this.setState(() => {
          return { bounds: bounds, cycleRoutes: paths };
        })
      });
    }

    if (this.state.showMTBRoutes) {
      overpassService.getMTBRoutes(bounds).then(result => {
        let paths = this.overpassWayConverter(result);
        this.setState(() => {
          return { bounds: bounds, MTBRoutes: paths };
        })
      });
    }
  };

  render() {
    if (this.state.showMountains) {
      var mountains = this.state.mountains.map((element) => {
        return (<CircleMarker center={[element.lat, element.lon]}
          color="grey" radius={4} 
          onClick={(event) => {
            let location = event.latlng;
            this.setState(() => {
              return { showPopup: true, popupLocation: location, popupContent: element.tags }
            })
          }}
          />)
      })
    } else {
      var mountains = "";
    }

    if (this.state.showVolcanoes) {
      var volcanoes = this.state.volcanoes.map((element) => {
        return (<CircleMarker center={[element.lat, element.lon]}
          color={red[500]} radius={4} 
          onClick={(event) => {
            let location = event.latlng;
            this.setState(() => {
              return { showPopup: true, popupLocation: location, popupContent: element.tags }
            })
          }}
          
          />);
      })
    } else {
      var volcanoes = "";
    }

    if (Object.values(this.state.showSacScale).some((val) => (val)) || this.state.showNoSacScale) {
      var paths = Object.keys(this.state.paths).map((key) => {
        var color;
        if (!("sac_scale" in this.state.paths[key].tags)) {
          color = this.pathColours[6];
        } else {
          var index = this.sacScale.indexOf(this.state.paths[key].tags['sac_scale']);
          color = this.pathColours[index];
        }
        return (<Polyline positions={this.state.paths[key].nodes}
          color={color}
          weight={5}
          onClick={(event) => {
            // console.log(event.latlng)
            let location = event.latlng;
            this.setState(() => {
              return { showPopup: true, popupLocation: location, popupContent: this.state.paths[key].tags }
            });
          }}
        />);
      })
    } else {
      var paths = "";
    }


    if (this.state.showCycleRoutes) {
      var cycleRoutes = Object.keys(this.state.cycleRoutes).map((key) => {
        return (<Polyline positions={this.state.cycleRoutes[key].nodes}
          color={this.cycleRoutesColour}
          weight={5}
          onClick={(event) => {
            let location = event.latlng;
            this.setState(() => {
              return { showPopup: true, popupLocation: location, popupContent: this.state.cycleRoutes[key].tags };
            })
          }}
        />);
      })
    } else {
      var cycleRoutes = "";
    }

    if (this.state.showMTBRoutes) {
      var MTBRoutes = Object.keys(this.state.MTBRoutes).map((key) => {
        return (<Polyline positions={this.state.MTBRoutes[key].nodes}
          color={this.MTBRoutesColour}
          weight={5}
          onClick={(event) => {
            let location = event.latlng;
            this.setState(() => {
              return { showPopup: true, popupLocation: location, popupContent: this.state.MTBRoutes[key].tags }
            })
          }}
        />)
      });
    } else {
      var MTBRoutes = "";
    }

    if (this.state.showRightClickPopup) {
      var decimals = Math.floor(Math.log10(360.0 / Math.pow(2, this.state.zoom) / 256)) * -1; // the 2 was added just by testing
      if (decimals < 0) {
        decimals = 0;
      }
      var righClickPopup = <Popup className="request-popup" position={this.state.rightClickPopupLocation}

        onClose={() => {
          this.setState({ showRightClickPopup: false, rightClickPopupElevation: "" })
        }}>
        <div style={popupContent}>
          <div style={popupHead}>
            What is here?
        </div>
          <span style={popupText}>
            <Typography> Coordinates: {this.state.rightClickPopupLocation.lat.toFixed(decimals)}, {this.state.rightClickPopupLocation.lng.toFixed(decimals)}
            </Typography>
            <Typography> Elevation: {this.state.rightClickPopupElevation} m
            </Typography>
          </span>
        </div>
      </Popup>
    } else {
      var rightClickPopup = "";
    }


    if (this.state.showPopup) {
      var noinfo = true;
      var content = Object.keys(this.state.popupContent).map((key) => {
        // if (key != "name" && key != "sac_scale" && key != "highway" &&) {
        if (!(["name", "sac_scale", "highway", "natural"]).includes(key) && key.match(/^name:/g) == null) {
          noinfo = false;
          let parsed_key = key.replace(/[:_]/g,' ');
          let units = ""
          if (parsed_key === "ele") {
            parsed_key = "elevation";
            units = "m";

          }

          return <><b>{parsed_key}:&nbsp;</b>{this.state.popupContent[key]} {units}  </>
        }
      })
      if (noinfo) {
        content = <Typography>No Info</Typography>;
      }


      var popup = <Popup className="request-popup" position={this.state.popupLocation}
        onClose={() => {
          this.setState({ showPopup: false });
        }}>
        <div style={popupContent}>
          <div style={popupHead}>
            {this.state.popupContent.name}
          </div>
          <span style={popupText}>
            {content}
          </span>
        </div>
      </Popup>
    } else {
      var popup = "";
    }

    if (this.state.showOpenStreetTiles) {
      var openStreetTiles = <TileLayer
        attribution='<a href="http://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" opacity={this.state.openStreetOpacity / 100}
      />
    } else {
      var openStreetTiles = "";
    }

    if (this.state.showOpenTopoTiles) {
      var openTopoTiles = <TileLayer
        attribution='<a href="https://www.mapzen.com/terms/">OpenTopoMap</a>'
        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" opacity={this.state.openTopoOpacity / 100}
      />

    } else {
      var openTopoTiles = "";
    }

    if (this.state.showElevationTiles) {
      var elevationTiles = <TileLayer
        attribution='<a href="https://www.mapzen.com/rights">Mapzen</a>'
        url="https://s3.amazonaws.com/elevation-tiles-prod/normal/{z}/{x}/{y}.png" opacity={this.state.elevationTileOpacity / 100}
      />
    } else {
      var elevationTiles = "";
    }

    return (
      <>
        <Map ref='map' onmoveend={this.handleMapChange}
          center={[this.state.lat, this.state.lng]}
          zoom={this.state.zoom}
          onzoomend={() => {
            this.setState({ zoom: this.refs.map.leafletElement.getZoom() })
          }}
          maxZoom={15}
          style={{ width: '100%', height: '60vh' }}
          oncontextmenu={(event) => {
            // console.log(event.layerPoint);
            this.setState({ rightClickPopupLocation: event.latlng, showRightClickPopup: true })
            overpassService.getElevation(event.latlng, this.state.zoom).then((elevation) => {
              this.setState({ rightClickPopupElevation: elevation })
            });
          }}
        >
          {mountains}
          {volcanoes}
          {paths}
          {cycleRoutes}
          {MTBRoutes}
          {popup}
          {righClickPopup}
          {openStreetTiles}
          {openTopoTiles}
          {elevationTiles}
          
        </Map>
        <Box mt={3}>
          <Paper elevation={3}>
            <Grid container spacing={3}>
              <Grid item md={4} sm={6} xs={12}>
                <FormGroup row>
                  <Box ml={2}><Typography>OpenStreetMaps Opacity</Typography>
                    </Box>
                  <Switch checked={this.state.showOpenStreetTiles} onClick={() => {
                    this.setState((prevstate) => {
                      return { showOpenStreetTiles: !(prevstate.showOpenStreetTiles) }
                    })
                  }}> </Switch>
                </FormGroup>
                <Slider disabled={!this.state.showOpenStreetTiles} value={this.state.openStreetOpacity} onChange={(event, newValue) => {
                  this.setState({ openStreetOpacity: newValue })
                }}
                  aria-labelledby="continuous-slider" />
              </Grid>

              <Grid item md={4} sm={6} xs={12}>
                <FormGroup row>
                  <Box ml={2}><Typography>
                    OpenTopoMaps Opacity</Typography></Box>
                  <Switch checked={this.state.showOpenTopoTiles} onClick={() => {
                    this.setState((prevstate) => {
                      return { showOpenTopoTiles: !(prevstate.showOpenTopoTiles) }
                    });
                  }}> </Switch>
                </FormGroup>
                <Slider disabled={!this.state.showOpenTopoTiles} value={this.state.openTopoOpacity} onChange={(event, newValue) => {
                  this.setState({ openTopoOpacity: newValue });
                }}
                  aria-labelledby="continuous-slider" />
              </Grid>

              <Grid item md={4} xs={12}>
                <FormGroup row>
                  <Box ml={2}><Typography id="discrete-slider" gutterBottom>
                    Mapzen Elevation Opacity</Typography></Box>
                  <Switch checked={this.state.showElevationTiles} onClick={() => {
                    this.setState((prevstate) => {
                      return { showElevationTiles: !(prevstate.showElevationTiles) }
                    });
                  }}> </Switch>
                </FormGroup>
                <Slider disabled={!this.state.showElevationTiles} value={this.state.elevationTileOpacity} onChange={(event, newValue) => {
                  this.setState({ elevationTileOpacity: newValue })
                }}
                  aria-labelledby="continuous-slider" />
              </Grid>
            </Grid>
          </Paper>

          <Paper>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography>Mountains</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid container spacing={3}>
                      <Grid item md={3}>
                        <Switch checked={this.state.showMountains} onClick={() => {
                          this.setState((prevstate) => {
                            return { showMountains: !(prevstate.showMountains) }
                          }, () => { this.handleMapChange() })
                        }} />
                      </Grid>
                      <Grid item md={9}>
                        <Typography>Min. Elevation: {this.state.minMountainElevation} m</Typography>
                        <Slider disabled={!this.state.showMountains}
                          value={this.state.minMountainElevation} min={0} max={9000} onChange={(event, newValue) => {
                            this.setState({ minMountainElevation: newValue })
                          }}
                          onChangeCommitted={() => {
                            this.handleMapChange();
                          }}
                          aria-labelledby="continuous-slider" />
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Grid>
              <Grid item xs={6}>
                <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography>Volcanoes</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid container spacing={3}>
                      <Grid item md={3}>
                        <VolcanoSwitch checked={this.state.showVolcanoes} onClick={() => {
                          this.setState((prevstate) => {
                            return { showVolcanoes: !(prevstate.showVolcanoes) }
                          }, () => { this.handleMapChange() });
                        }} />
                      </Grid>
                      <Grid item md={9}>
                        <Typography>{this.state.minVolcanoElevation > 0 ? "Min. Elevation: " + this.state.minVolcanoElevation + "m" : "All Volcanoes"}
                        </Typography>
                        <Slider disabled={!this.state.showVolcanoes}
                          value={this.state.minVolcanoElevation} min={0} max={7000} onChange={(event, newValue) => {
                            this.setState({ minVolcanoElevation: newValue })
                          }}
                          onChangeCommitted={() => {
                            this.handleMapChange();
                          }}
                          aria-labelledby="continuous-slider" />
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Grid>
            </Grid>
          </Paper>

          <Paper>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography>Hiking Paths</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <FormGroup row>
                          {this.sacScale.map((sacScale, index) => {
                            let words = sacScale.replace(/_/g, " ");
                            const capitalize = words.split(' ').map(w => w.substring(0, 1).toUpperCase() + w.substring(1)).join(' ');
                            return (<FormControlLabel control={<Checkbox
                              style={{
                                color: this.state.showSacScale[sacScale] ? this.pathColours[index] : theme.secondary
                              }}
                              checked={this.state.showSacScale[sacScale]}
                              onChange={() => {
                                this.setState((prevstate) => {
                                  prevstate.showSacScale[sacScale] = !prevstate.showSacScale[sacScale];
                                  return { showSacScale: prevstate.showSacScale };
                                }, () => { this.handleMapChange(); })
                              }

                              } />} label={capitalize} />
                            )
                          })}

                          <FormControlLabel control={<Checkbox checked={this.state.showNoSacScale}
                            onChange={() => {
                              this.setState((prevstate) => ({ showNoSacScale: !prevstate.showNoSacScale }), () => { this.handleMapChange() })
                            }}
                            style={{
                              color: this.state.showNoSacScale ? this.pathColours[6] : theme.secondary
                            }}
                          />}
                            label="No SAC Scale" />
                        </FormGroup>
                      </Grid>
                      <Grid item xs={12}>

                        <Typography>These trail catagories are from the openstreetmap's sac_scale</Typography>
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Grid>
              <Grid item xs={6}>
                <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography>Bicycle Paths</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <FormGroup row>
                          <FormControlLabel control={<Checkbox checked={this.state.showCycleRoutes}
                            onChange={() => {
                              this.setState((prevstate) => ({ showCycleRoutes: !prevstate.showCycleRoutes }), () => { this.handleMapChange() })
                            }}
                            style={{
                              color: this.state.showCycleRoutes ? this.cycleRoutesColour : theme.secondary
                            }}
                          />}
                            label="Bicycle Routes" />

                          <FormControlLabel control={<Checkbox checked={this.state.showMTBRoutes}
                            onChange={() => {
                              this.setState((prevstate) => ({ showMTBRoutes: !prevstate.showMTBRoutes }), () => { this.handleMapChange() })
                            }}
                            style={{
                              color: this.state.showMTBRoutes ? this.MTBRoutesColour : theme.secondary
                            }}
                          />}
                            label="Mountain Bike Routes" />
                        </FormGroup>
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </>
    )
  }
}

export default MyMap;
