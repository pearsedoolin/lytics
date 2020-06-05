#pull official base image (python and linux alpine)
FROM certbot/certbot

ADD crontab.txt /crontab.txt
ADD script.sh /script.sh
ADD entrypoint.sh /entrypoint.sh
RUN chmod 755 /script.sh /entrypoint.sh
RUN echo "crontab being set up"
RUN /usr/bin/crontab /crontab.txt
ENTRYPOINT [ "/bin/sh" ]
CMD ["/entrypoint.sh"]

    #     command: certonly --webroot -w /var/www/certbot --email pearsedoolin@gmail.com --agree-tos --no-eff-email --force-renewal -d www.lytics.ca -d lytics.ca
