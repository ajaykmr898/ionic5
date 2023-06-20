FROM phusion/baseimage:bionic-1.0.0

RUN DEBIAN_FRONTEND=noninteractive
RUN locale-gen en_US.UTF-8

ENV LANGUAGE=en_US.UTF-8
ENV LC_ALL=en_US.UTF-8
ENV LC_CTYPE=en_US.UTF-8
ENV LANG=en_US.UTF-8
ENV TERM xterm

# Install "Extentions", "libraries", "Software's"
RUN apt-get update && \
    apt-get install -y --allow-downgrades --allow-remove-essential \
        --allow-change-held-packages \
        pkg-config \
        libcurl4-openssl-dev \
        libedit-dev \
        libssl-dev \
        libxml2-dev \
        xz-utils \
        git \
        curl \
        vim \
        libzip-dev zip unzip \
    && apt-get autoremove -y \
    && apt-get clean

# Install nodejs and Angular cli.
RUN curl -sL https://deb.nodesource.com/setup_14.x  | bash -
RUN apt-get -y install nodejs
RUN npm install -g @angular/cli

CMD ["tail", "-f"]

ARG MAX_OLD_SPACE_SIZE=5120
ENV NODE_OPTIONS=--max_old_space_size=$MAX_OLD_SPACE_SIZE

WORKDIR /var/www/html/1782-Dynamics-Sales/
