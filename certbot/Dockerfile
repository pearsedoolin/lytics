#pull official base image (python and linux alpine)
FROM certbot/certbot

ADD crontab.txt /crontab.txt
ADD script.sh /script.sh
RUN chmod 755 /script.sh
RUN /usr/bin/crontab /crontab.txt
RUN /usr/sbin/crond -l 8