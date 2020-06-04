#pull official base image (python and linux alpine)
FROM certbot/certbot

ENTRYPOINT "/bin/sh"
ADD crontab.txt /crontab.txt
ADD script.sh /script.sh
RUN chmod 755 /script.sh
RUN echo "crontab being set up"
RUN /usr/bin/crontab /crontab.txt
RUN /usr/sbin/crond -l -f 8
CMD ["certbot renew && /usr/sbin/crond -f -l 8"]

    #     command: certonly --webroot -w /var/www/certbot --email pearsedoolin@gmail.com --agree-tos --no-eff-email --force-renewal -d www.lytics.ca -d lytics.ca
