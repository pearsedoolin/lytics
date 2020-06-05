#!/bin/sh

certbot renew && /usr/sbin/crond -f -l 8
