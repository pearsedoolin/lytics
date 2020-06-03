import React from 'react';
import Container from '@material-ui/core/Container';
// import Typography from '@material-ui/core/Typography';
// import Link from '@material-ui/core/Link';
import Dashboard from './Dashboard';


// function Copyright() {
//   return (
//     <Typography variant="body2" color="textSecondary" align="center">
//       {'Copyright © '}
//       <Link color="inherit" href="https://material-ui.com/">
//         Lytics
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

export default function App() {
  return (
    <Container maxWidth="lg">
      {/* <Box my={4}> */}
        {/* <Typography variant="h4" component="h1" gutterBottom>
          Create React App v4-beta example
        </Typography> */}
        <Dashboard />
        {/* <ProTip /> */}
        {/* <Copyright /> */}
      {/* </Box> */}
    </Container>
  );
}
