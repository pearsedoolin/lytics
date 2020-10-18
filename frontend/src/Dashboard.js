import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Plotter from './Plotter';
import MyMap from './Map';
import theme from './theme'


import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import Map from '@material-ui/icons/Map';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  Link as RouterLink,
} from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://lytics.ca/">
        Lytics
        </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      open: false,
      window: ""  
    }
  }


  handleDrawerOpen = () => {
    this.setState({ open: true });
  };
  handleDrawerClose = () => {
    this.setState({ open: false });
  };
  changeWindow = (text) => {
    this.setState({ window: text, open: false });
  };


  MyNavbar = () => {

    let location = useLocation().pathname;
    if (location === "/" || location === "/maps") {
      var navbarTitle = "Maps";
    } else {
      var navbarTitle = "Stats";
    }

    return (
      <>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={this.handleDrawerOpen}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">
              {navbarTitle}
            </Typography>
          </Toolbar>
        </AppBar>
        <SwipeableDrawer drawerWidth={1000}
          open={this.state.open} onOpen={()=>{}} onClose={()=>{}}
        >
          <IconButton onClick={this.handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
          <Divider />
          <List>
            {['Statistics Plotter', 'Maps'].map((text, index) => (
              <RouterLink key={index} to={index % 2 === 0 ? "/stats" : "/maps"} onClick={() => this.changeWindow(text)} style={{ textDecoration: 'none' }}>
                <ListItem key={index} button onClick={() => this.changeWindow(text)}>
                  <ListItemIcon>{index % 2 === 0 ? <ShowChartIcon /> : <Map />}</ListItemIcon>
                  <ListItemText primary={text} style={{color: theme.palette.text.primary}}/>
                </ListItem>
              </RouterLink>
            ))}
          </List>
        </SwipeableDrawer>
      </>
    );
  }

  render() {
    return (
      <>
        <CssBaseline />
        <main >
          <Container maxWidth="xl" >
            <Router>
              <this.MyNavbar />
              <Switch>
                <Route path="/stats">
                  <Plotter />
                </Route>
                <Route path="/maps">
                  <MyMap />
                </Route>
                <Route path="/">
                  <MyMap />
                </Route>
              </Switch>

            </Router>
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
        <CssBaseline />
      </>
    )
  }
}

export default Dashboard;
