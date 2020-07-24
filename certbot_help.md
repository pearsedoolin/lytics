## Getting https working
If there is no certificate on the host maching, you will need to comment out the entire 443 server in the nginx config file. I also recommend commenting out every other container except the certbot and nginx in the docker-compose yml file.

Make sure the certbot command in the following:

certonly --webroot -w /var/www/certbot --email *****@gmail.com --agree-tos --no-eff-email --force-renewal -d www.lytics.ca -d lytics.ca

Also make sure the /var/www/certbot volume (which allow for the certbot challenge) and the /etc/letsencrypt volume (which stores the certificate) on both the nginx and certbot containers are connected.

run docker-compose -f docker-compse.live.yml up

This should spit out a message saying the certificate was successfully generated. Check for it on the host in the certbot/conf folder.

