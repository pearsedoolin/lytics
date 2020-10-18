import React from 'react';
import { TileLayer } from 'react-leaflet'
import WarningIcon from '@material-ui/icons/Warning';
import {
    Box,
    FormGroup,
    Slider,
    Typography,
    Tooltip,
    Switch,
    withStyles,
} from '@material-ui/core';
import {green } from '@material-ui/core/colors';

const GreenSwitch = withStyles({
    switchBase: {
        '&$checked': {
            color: green[500],
        },
        '&$checked + $track': {
            backgroundColor: green[500],
        },
    },
    checked: {},
    track: {},
})(Switch);

export function MapLayer(props) {
    if (props.show) return (
        <TileLayer
            attribution={props.attribution}
            url={props.url}
            opacity={props.opacity} />
    );
    else return null;
}

export function MapLayerController(props) {
    if (props.zoom > props.maxZoom) {
        var warning = <Tooltip title="Unavailable at this zoom">
            <WarningIcon style={{ color: "orange" }} />
        </Tooltip>
    } else warning = null;
    
    return (
        <>
            <FormGroup row>
                <Box ml={2}><Typography>{props.title} Opacity</Typography>
                </Box>
                <GreenSwitch checked={props.showLayer} onChange={(event, val) => {
                        props.setShowLayer(val);
                    }
                } />
                {warning}
            </FormGroup>
            <Slider disabled={!props.showLayer} defaultValue={props.opacity}
                onChange={(event, newValue) => {
                    props.setOpacity(newValue);
                }} />
        </>
    )
}