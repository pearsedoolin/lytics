# Lytics

Lytics is a web app built for displaying statistics and mapping data. The front-end is built using React.js and Material-UI and the backend using Django Rest framework to respond to API calls for data. Lytics is a multi-container Docker applcation with the Django, PostgreSQL, React, NginX, and Certbot all running in seperate containers. 


## Maps
The purpose of the [mapping page](https://lytics.ca/maps) is to make an easy to use map for finding hiking and bicycling trails. The base map tiles are loaded from openstreetmaps, opentopomaps, and Mapzen's terrain tiles (Open Data on AWS S3). Vector paths and points are accessed using OpenStreetMaps' Overpass API and this allows hiking paths, bike paths, mountains etc. to be highlighted.


## Stats

The data for the [statistics plotter](https://lytics.ca/stats) was downloaded from [open.canada.ca](https://open.canada.ca) it was then restructured using Pandas and stored in a PostreSQL database.


## Running

To run the app use `docker-compose -f docker-compose.live.yml up`.

If there is an error it could be for one of these reasons:

1. NGINX could already be running on your machine and using a port that docker needs. Check its status using `sudo servince nginx status`