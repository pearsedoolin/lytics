  import React from 'react';
  import clsx from 'clsx';
  import { makeStyles } from '@material-ui/core/styles';
  import CssBaseline from '@material-ui/core/CssBaseline';
  import Drawer from '@material-ui/core/Drawer';
  import Button from '@material-ui/core/Button';
  import Box from '@material-ui/core/Box';
  import AppBar from '@material-ui/core/AppBar';
  import Toolbar from '@material-ui/core/Toolbar';
  import List from '@material-ui/core/List';
  import Typography from '@material-ui/core/Typography';
  import Divider from '@material-ui/core/Divider';
  import IconButton from '@material-ui/core/IconButton';
  import Container from '@material-ui/core/Container';
  import Paper from '@material-ui/core/Paper';
  import Link from '@material-ui/core/Link';
  import MenuIcon from '@material-ui/icons/Menu';
  import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
  import { mainListItems } from './listItems';
  // import Chart from './Chart';
  import Plotter from './Plotter';

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

  const drawerWidth = 240;

  export default function Dashboard() {
    // const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const handleDrawerOpen = () => {
      setOpen(true);
    };
    const handleDrawerClose = () => {
      setOpen(false);
    };

    return (
      <div >
        <CssBaseline />
        <main >
          <div />
          <Container maxWidth="xl" >
            <Plotter />
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    );
  }
