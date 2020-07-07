import React, { Component } from 'react';
import Title from './Title';
import DatabaseService from './DatabaseService';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import theme from './theme'
import { LineChart, Line, XAxis, YAxis, Label, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Paper } from '@material-ui/core';
import { colours } from './GraphColours';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const databaseService = new DatabaseService();

function dateFormatter(tickItem) {
  // If using moment.js
  let startDate = new Date(1, 1, 1);
  startDate.setFullYear(1);
  startDate.setDate(startDate.getDate() + tickItem);
  let dd = startDate.getDate();
  let mm = startDate.getMonth();
  let y = startDate.getFullYear();
  return dd + '/' + mm + '/' + y;
}
class Graph extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if(this.props.data === undefined) {
      return (<></>)
    }
    else if (Object.keys(this.props.data).length === 0) {
      return (<></>)
    }
    else {
      return (
        <>
          <Title>{this.props.title}</Title>
          <ResponsiveContainer height={300}>
            <LineChart
              data={this.props.data}
              syncId="anyId"
              margin={{
                top: 16,
                right: 16,
                bottom: 0,
                left: 24,
              }}
            >
              <XAxis dataKey="date"
                type="number"
                stroke={theme.palette.text.secondary}
                allowDuplicatedCategory={false}
                tickFormatter={dateFormatter}
                domain={[dataMin => (this.props.xmin), dataMax => (this.props.xmax)]} />
     />
      <YAxis dataKey="data"
                stroke={theme.palette.text.secondary}
              >

                <Label
                  angle={270}
                  position="left"
                  style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
                > {this.props.ylabel} 
                </Label>
              </YAxis>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Tooltip formatter={(value, name) => {
                return [value, this.props.dataNames[name].name]
                }}
                labelFormatter={(label) => {
                  return [dateFormatter(label)]
                  }}/>
              {Object.keys(this.props.data).map((k, i) => (
                <Line dataKey='data'
                  type="monotone"
                  data={this.props.data[k]}
                  name={k}
                  key={k}
                  stroke={colours[k]} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </>
      );
    }
  }
}

class DataSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //dataNames is a dict of {pk: {name: , checked: }}
      dataNames: {},
      /*data is keyed by the cities' pk so it has the format the format:
      {17: [{date: timestamp, data: 2.3},
            {date: timestamp, data: 2.3},
          ]
      }
      */
      data: {}
    }
  }

  componentDidMount() {
    console.log(this.props.dataType)
    databaseService.getDataNames(this.props.dataType).then(result => {
      let dataNames = {}
      let key;

      console.log(result.dataNames);

      for (key in result.dataNames) {
        let name = { name: result.dataNames[key].name, checked: false };
        dataNames[result.dataNames[key].pk] = name
      }

      this.setState({dataNames: dataNames});
    });
  }


  checkboxClicked(pk){
    var dataToAdd = []
    //adding data
    if (!this.state.dataNames[pk].checked) {
      databaseService.getData(this.props.dataType, this.state.dataNames[pk].name).then(
        (result) => {

          for (let i = 0; i < (result.dates.length); i++) {
            dataToAdd.push({ date: result.dates[i], data: result.data[i] })
          }
          this.setState(prevState => {
            let dataNames = prevState.dataNames;
            let data = prevState.data;
            dataNames[pk].checked = true;
            data[pk] = dataToAdd;
            
            var xmin = 10000000;
            var xmax = -1; 
            for (let i =0; i < Object.values(data).length; i++) {
              let min =  Object.values(data)[i][0]['date']
              let max = Object.values(data)[i][Object.values(data)[i].length -1]['date']

              xmin = (min < xmin)? min : xmin;
              xmax = (max > xmax)? max: xmax;
            }
            this.props.onDataChanged(this.props.id, dataNames, data, xmin, xmax);
            return { dataNames: dataNames, data: data };
          })
        });
    } else {
      this.setState(prevState => {
        let dataNames = prevState.dataNames;
        let data = prevState.data;
        dataNames[pk].checked = false;
        delete data[pk];

        var xmin = 10000000;
        var xmax = -1; 
        for (let i =0; i < Object.values(data).length; i++) {
          let min =  Object.values(data)[i][0]['date']
          let max = Object.values(data)[i][Object.values(data)[i].length -1]['date']

          xmin = (min < xmin)? min : xmin;
          xmax = (max > xmax)? max: xmax;
        }

        this.props.onDataChanged(this.props.id, dataNames, data, xmin, xmax);
        return { dataNames: dataNames, data: data };
      })
    }
  };

  render() {
    return (
      <>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
        <Typography>{this.props.title}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        <FormGroup row>
          {Object.keys(this.state.dataNames).map((pk) => {
            return (
              <FormControlLabel key={pk}
                control={<Checkbox
                  onChange={() => this.checkboxClicked(pk)}
                  checked={this.state.dataNames[pk].checked}
                  style={{
                    color: this.state.dataNames[pk].checked ? colours[pk] : theme.secondary
                  }}
                />}
                label={this.state.dataNames[pk].name}
              />)
          })}
        </FormGroup>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      </>
    );

  }
}
class Plotter extends Component {
  constructor(props) {
    super(props);
    this.vacancyTitle = 'Vacancy Data'
    this.housingStartsTitle = 'Housing Starts Data'
    this.housingPriceIndexTitle = 'Housing Price Index'


    this.state = {
      data: {},
      dataNames: {},
      xmin: null,
      xmax: null,
      xmins: {},
      xmaxs: {}
    }
  }


  dataChanged = (id, dataNames, data, xDataMin, xDataMax) => {
    // console.log('vacancy data', data)
    this.setState((prevState) => {
      if (Object.values(data).length == 0) {
        var xmins = prevState.xmins;
        delete xmins[id];

        var xmaxs = prevState.xmaxs;
        delete xmaxs[id];
      } else {
        var xmins = prevState.xmins;
        xmins[id] = xDataMin

        var xmaxs = prevState.xmaxs;
        xmaxs[id] = xDataMax
      }
      let prevData = prevState.data;
      prevData[id] = data;

      let prevDataNames = prevState.dataNames;
      prevDataNames[id] = dataNames;

      let mins = Object.values(xmins);
      let min = Math.min(...mins);

      let maxs = Object.values(xmaxs);
      let max = Math.max(...maxs);

      return { data: prevData, dataNames: prevDataNames, xmins, xmaxs, xmin: min, xmax: max }
    })
  }

  render() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h1>Statistics Plotter</h1>
          <p> This page can be used to plot data from <a href="https://open.canada.ca/">opencanada</a>
</p>
          </Grid>

        <Grid item xs={12}>
          <Paper>
            <Graph
              id={1}
              title={this.vacancyTitle}
              data={this.state.data[1]}
              xmin={this.state.xmin}
              xmax={this.state.xmax}
              dataNames={this.state.dataNames[1]}
              ylabel='Vacancy Rate %'
            />
          </Paper>
          <Paper>
            <Graph
              id={2}
              title={this.housingStartsTitle}
              data={this.state.data[2]}
              dataNames={this.state.dataNames[2]}
              xmin={this.state.xmin}
              xmax={this.state.xmax}
              ylabel='Housing Starts'
            />
          </Paper>
          <Paper>
            <Graph
              id={3}
              title={this.housingPriceIndexTitle}
              data={this.state.data[3]}
              dataNames={this.state.dataNames[3]}
              xmin={this.state.xmin}
              xmax={this.state.xmax}
              ylabel='Housing Price Index'
            />
          </Paper>
        </Grid>
        <Grid item xs={12}>
        
            <DataSelector
              id={1}
              title={this.vacancyTitle}
              dataType='vacancydatasixunits'
              onDataChanged={this.dataChanged}
              />

          <Paper>
            <DataSelector
              id={2}
              title={this.housingStartsTitle}
              dataType='housingstarts'
              onDataChanged={this.dataChanged}/>
          </Paper>

          <Paper>
            <DataSelector
              id={3}
              title={this.housingPriceIndexTitle}
              dataType='housingpriceindex'
              onDataChanged={this.dataChanged}/>
          </Paper>

        </Grid>
      </Grid>
    );
  }
}

export default Plotter;
