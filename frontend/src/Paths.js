import React, {useCallback, useEffect} from 'react';
import {
  Grid,
  FormGroup,
  FormControlLabel,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Checkbox,
} from '@material-ui/core';
import {Polyline} from 'react-leaflet';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

/**
 *
 * @param {*} props
 */
export function PathsController(props) {
  useEffect(() => {
    // props.updatePaths();
  }, [props.pathTypes]);

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography>{props.title}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormGroup row>
              {Object.keys(props.pathTypes).map((type, index) => {
                return (<FormControlLabel key={type} control={<Checkbox
                  style={{
                    color: props.pathTypes[type].show ? props.pathTypes[type].color : '#555', // theme.secondary
                  }}
                  // checked={props.pathTypes[type].show}
                  onChange={(event, val) => {
                    props.setPathTypes((prev) => {
                      console.log('checkbox switched to: ' + val);
                      prev[type].show = val;
                      // console.log(props.pathTypes);
                      return {...prev};
                    });
                  }}
                />} label={props.pathTypes[type].string} />
                );
              })}
            </FormGroup>
          </Grid>
          <Grid item xs={12}>
            <Typography>{props.note}</Typography>
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}
/**
 *
 * @param {*} props
 */
export function Paths(props) {
//   const handleClick = useCallback((props, key) => {
//     props.setShowPopup(true);
//     if ('name' in props.paths[key].tags) {
//       props.setPopupTitle(props.paths[key].tags.name);
//     } else props.setPopupTitle('');
//     props.setPopupLocation(event.latlng);
//     props.setPopupTags(props.paths[key].tags);
//     props.setHighlightedPathID(key);
//     console.log('key: ' + key);
//     console.log('highlightedPathID: ' + props.highlightedPathID);
//     console.log(props.paths);
//   }, []);

  return (
    Object.keys(props.paths).map((key) => {
      let color = '#333';
      if ('hiking' in props.pathTypes) {
        if (!('sac_scale' in props.paths[key].tags)) {
          color = props.pathTypes['no_sac_scale'].color;
        } else {
          color = props.pathTypes[props.paths[key].tags['sac_scale']].color;
        }
      } else if ('MTB' in props.pathTypes) {
        // console.log(props.paths[key])

        if ('mtb:scale' in props.paths[key].tags ||
                    'mtb:scale:imba' in props.paths[key].tags ||
                    'mtb:type' in props.paths[key].tags) {
          color = props.pathTypes['MTB'].color;
        } else {
          color = props.pathTypes['Cycle'].color;
        }
        if (key === props.highlightedPathID) {
          color = '#f89454';
        }
      }
      return (<Polyline key={key} positions={props.paths[key].nodes}
        color={color}
        weight={5}
        eventHandlers={{
          click(event) {
            props.setShowPopup(true);
            if ('name' in props.paths[key].tags) {
              props.setPopupTitle(props.paths[key].tags.name);
            } else props.setPopupTitle('');
            props.setPopupLocation(event.latlng);
            if (props.setShowPopup) {
              props.setPopupTags(props.paths[key].tags);
            }
            props.setHighlightedPathID(key);
            console.log('key: ' + key);
            console.log('highlightedPathID: ' + props.highlightedPathID);
            console.log(props.paths);
          },
        }} />);
    })
  );
}
