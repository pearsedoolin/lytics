import React, { useEffect } from 'react';
import {
    Grid,
    Switch,
    Slider,
    Typography,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {CircleMarker} from 'react-leaflet';
import { point } from 'leaflet';
export function PointsWithElevationController(props) {
    useEffect(() => {
        props.updatePoints();
    }, [props.minElevation, props.show])

    return (
        <ExpansionPanel>
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography>{props.title}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <Grid container spacing={3}>
                    <Grid item md={3}>
                        <Switch checked={props.show} onChange={(event, val) => {
                            console.log("onChange", val);
                            props.setShow(val);
                        }} />
                    </Grid>
                    <Grid item md={9}>
                        <Typography>{props.minElevation > 0 ? "Min. Elevation: " + props.minElevation + "m" : "All Volcanoes"}
                        </Typography>
                        <Slider disabled={!props.show}
                            value={props.minElevation} min={0} max={7000} onChange={(event, newValue) => {
                                props.setMinElevation(newValue);
                            }}
                            onChangeCommitted={() => {
                                console.log("change committed");
                            }}
                        />
                    </Grid>
                </Grid>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
}

export function PointsWithElevation(props) {

    if (props.show) {
        var p = props.points.map((point) => {
            return (
                <CircleMarker center={[point.lat, point.lon]}
                    color={props.color}
                    radius={4}
                    eventHandlers={{
                        click() {
                            console.log("point clicked", point)
                            props.setShowPopup(true);
                            if("name" in point.tags) { props.setPopupTitle(point.tags.name) }
                            else props.setPopupTitle("")
                            props.setPopupLocation({lat: point.lat, lon: point.lon})
                            props.setPopupTags(point.tags);
                        }
                    }}
                />
            )
        })
        return p;
    } else return null;
}

