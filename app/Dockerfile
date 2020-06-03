#pull official base image (python and linux alpine)
FROM ubuntu:20.04

WORKDIR /usr/src/app

#set envormoental valiables
#This prevents python from wirtinc pyc files to disc
ENV PYTHONDONTWRITEBYTECODE 1

#prevents python from byffering stdout and stderr
ENV PYTHONUNBUFFERED 1

#set timesone

ENV TZ=America/Vancouver
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

#install python
RUN apt-get update -y && apt-get install -y python3.8 python3-pip python3-dev libpq-dev netcat
# postgresql postgresql-contrib nginx

RUN pip3 install --upgrade pip

# install dependencies
RUN pip3 install --upgrade pip
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip3 install -r requirements.txt


# copy entrypoint.sh
COPY ./entrypoint.sh /usr/src/app/entrypoint.sh

#copy project
COPY . /usr/src/app

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
