import React, { Component } from 'react';
import Title from './Title';
import DatabaseService from './DatabaseService';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import theme from './theme'
import { LineChart, Line, XAxis, YAxis, Label, CartesianGrid, ResponsiveContainer } from 'recharts';
import moment from 'moment'
import { Paper } from '@material-ui/core';

const plotly_colors = [
  '#D8BFD8',  // thistle
  '#6495ED',  // cornflowerblue
  // '#FFFAFA',  // snow
  // '#F0FFFF',  // azure
  '#FFA500',  // orange
  '#DB7093',  // palevioletred
  '#9370DB',  // mediumpurple
  // '#F5FFFA',  // mintcream
  '#B0C4DE',  // lightsteelblue
  '#FFE4C4',  // bisque
  // '#FFFACD',  // lemonchiffon
  // '#FFE4E1',  // mistyrose
  // '#FFFFE0',  // lightyellow
  '#008B8B',  // darkcyan
  '#7FFFD4',  // aquamarine
  '#40E0D0',  // turquoise
  '#00008B',  // darkblue
  '#EE82EE',  // violet
  // '#FFF8DC',  // cornsilk
  // '#87CEFA',  // lightskyblue
  // '#F0FFF0',  // honeydew
  '#4B0082',  // indigo
  '#808080',  // gray
  '#FF69B4',  // hotpink
  '#008000',  // green
  '#48D1CC',  // mediumturquoise
  '#F4A460',  // sandybrown
  // '#E0FFFF',  // lightcyan
  '#FF00FF',  // magenta
  '#FF0000',  // red
  '#F0E68C',  // khaki
  '#00FA9A',  // mediumspringgreen
  // '#F8F8FF',  // ghostwhite
  '#7FFF00',  // chartreuse
  '#FF00FF',  // fuchsia
  '#DC143C',  // crimson
  '#3CB371',  // mediumseagreen
  '#00BFFF',  // deepskyblue
  '#8B008B',  // darkmagenta
  '#DEB887',  // burlywood
  '#2F4F4F',  // darkslategray
  '#FFB6C1',  // lightpink
  '#FF4500',  // orangered
  '#B0E0E6',  // powderblue
  // '#FFF5EE',  // seashell
  '#DA70D6',  // orchid
  '#4169E1',  // royalblue
  '#9932CC',  // darkorchid
  '#008080',  // teal
  '#800080',  // purple
  // '#FAEBD7',  // antiquewhite
  '#FFFF00',  // yellow
  '#778899',  // lightslategrey
  '#8B0000',  // darkred
  '#CD853F',  // peru
  '#708090',  // slategrey
  '#5F9EA0',  // cadetblue
  '#B22222',  // firebrick
  '#E9967A',  // darksalmon
  // '#FFDEAD',  // navajowhite
  '#1E90FF',  // dodgerblue
  '#BA55D3',  // mediumorchid
  '#808080',  // grey
  '#FFEFD5',  // papayawhip
  // '#90EE90',  // lightgreen
  '#696969',  // dimgray
  '#66CDAA',  // mediumaquamarine
  '#BC8F8F',  // rosybrown
  '#FFEBCD',  // blanchedalmond
  '#7CFC00',  // lawngreen
  '#FF1493',  // deeppink
  '#9400D3',  // darkviolet
  '#A9A9A9',  // darkgray
  '#F5F5DC',  // beige
  '#8A2BE2',  // blueviolet
  '#2F4F4F',  // darkslategrey
  '#F5DEB3',  // wheat
  '#6A5ACD',  // slateblue
  '#FA8072',  // salmon
  '#00FFFF',  // aqua
  // '#FFFAF0',  // floralwhite
  '#FFC0CB',  // pink
  '#0000FF',  // blue
  '#7B68EE',  // mediumslateblue
  '#00FFFF',  // cyan
  '#C71585',  // mediumvioletred
  '#FFD700',  // gold
  '#FF6347',  // tomato
  '#DDA0DD',  // plum
  '#FAF0E6',  // linen
  '#000080',  // navy
  '#800000',  // maroon
  '#00FF00',  // lime
  '#228B22',  // forestgreen
  '#BDB76B',  // darkkhaki
  '#D2691E',  // chocolate
  '#000000',  // black
  '#D3D3D3',  // lightgray
  '#708090',  // slategray
  '#FF7F50',  // coral
  '#A0522D',  // sienna
  '#FFFFF0',  // ivory
  '#E6E6FA',  // lavender
  '#006400',  // darkgreen
  '#778899',  // lightslategray
  '#FFF0F5',  // lavenderblush
  '#00CED1',  // darkturquoise
  '#87CEEB',  // skyblue
  '#6B8E23',  // olivedrab
  '#696969',  // dimgrey
  '#9ACD32',  // yellowgreen
  '#DAA520',  // goldenrod
  '#C0C0C0',  // silver
  // '#FFFFFF',  // white
  '#483D8B',  // darkslateblue
  '#D2B48C',  // tan
  '#8FBC8F',  // darkseagreen
  '#F5F5F5',  // whitesmoke
  // '#F08080',  // lightcoral
  // '#D3D3D3',  // lightgrey
  '#556B2F',  // darkolivegreen
  '#20B2AA',  // lightseagreen
  '#B8860B',  // darkgoldenrod
  '#A52A2A',  // brown
  '#32CD32',  // limegreen
  '#DCDCDC',  // gainsboro
  '#4682B4',  // steelblue
  // '#ADD8E6',  // lightblue
  '#2E8B57',  // seagreen
  '#FFE4B5',  // moccasin
  '#0000CD',  // mediumblue
  '#FDF5E6',  // oldlace
  '#663399',  // rebeccapurple
  '#A9A9A9',  // darkgrey
  '#AFEEEE',  // paleturquoise
  '#808000',  // olive
  '#FFDAB9',  // peachpuff
  '#F0F8FF',  // aliceblue
  '#8B4513',  // saddlebrown
  '#00FF7F',  // springgreen
  '#CD5C5C',  // indianred
  // '#FAFAD2',  // lightgoldenrodyellow
  // '#FFA07A',  // lightsalmon
  '#EEE8AA',  // palegoldenrod
  '#FF8C00',  // darkorange
  '#98FB98',  // palegreen
  '#191970',  // midnightblue
  '#ADFF2F',  // greenyellow
  
];

const databaseService = new DatabaseService();

// export default function Orders() {
class VacancyRates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //cities are objects with names, pks and checked attributes
      cities: [],
      //data are artibutes with name, dates, data
      data: {}
    }
    // this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {

    databaseService.getVacancyCities().then(result => {
      // console.log(result.cities);
      let cities = []
      let key;
      // console.log(result)

      for (key in result.cities) {
        let city = { ...result.cities[key], checked: false };
        cities.push(city)
      }

      this.setState({ cities: cities });
    });

    // databaseService.getVacancyData('faketown').then(function (result) {
    //   console.log(result);

    // });
  }

  handleChange = i => (event) => {
    // console.log('handling change')
    //Toggle checked
    var dataToAdd = []

    if (!this.state.cities[i].checked) {
      // console.log("adding data")
      databaseService.getVacancyData(this.state.cities[i].name).then(
        (result) => {
          for (let i = 0; i < (result.dates.length); i++) {
            dataToAdd.push({ date: result.dates[i], data: result.data[i] })
          }
          this.setState(prevState => {
            let cities = prevState.cities;
            let data = prevState.data;
            cities[i].checked = true;
            data[cities[i].pk] = dataToAdd;
            return { cities: cities, data: data };
          })
        });
    } else {
      this.setState(prevState => {
        let cities = prevState.cities;
        let data = prevState.data;
        cities[i].checked = false;
        delete data[cities[i].pk];
        return { cities: cities, data: data };
      })

    }
    // return {cities, data}

  };

  myDateFormatter(tickItem) {
    // If using moment.js
    let startDate = new Date(1, 1, 1);
    startDate.setFullYear(1);
    startDate.setDate(startDate.getDate() + tickItem); 
    let dd = startDate.getDate();
    let mm = startDate.getMonth();
    let y = startDate.getFullYear();
    
    return dd + '/'+ mm + '/'+ y;

  }



  //if box is now unchecked, delete data for city


  // this.setState({ data: this.state.data });
  // console.log("Data: ", this.state.data)
  // self.setState({ ...state, [event.target.name]: event.target.checked });
  // };

  render() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
        <Paper>

          {/* <React.Fragment> */}
            <Title>Graph</Title>
            <ResponsiveContainer height={300}>
              <LineChart
                // data={this.state.data}
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
                  tickFormatter={this.myDateFormatter}
                  domain={[null, null]}
                />
                <YAxis dataKey="data"
                  stroke={theme.palette.text.secondary}
                >
                  <Label
                    angle={270}
                    position="left"
                    style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
                  >
                    Vacancy Rate (%)
            </Label>
                </YAxis>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                {Object.keys(this.state.data).map((k, i) => (
                  <Line dataKey='data'
                    data={this.state.data[k]}
                    name={k}
                    key={k}
                    stroke={plotly_colors[k]} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          {/* </React.Fragment> */}
          </Paper>

        </Grid>
        <Grid item xs={12}>
        <Paper>
        <Title>Vacancy Data</Title>


          <FormGroup row>
            {this.state.cities.map((c, i) => {
              return (
                <FormControlLabel key={i}
                  control={<Checkbox
                    onChange={this.handleChange(i)}
                    checked={c.checked}
                    style={{
                      color: c.checked? plotly_colors[c.pk] : theme.secondary
                    }}
                  />}
                  label={c.name}
                />)
            })}
          </FormGroup>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default VacancyRates;
