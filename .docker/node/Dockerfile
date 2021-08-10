FROM node:latest

RUN useradd -ms /bin/bash nodeuser
RUN usermod -aG node nodeuser

RUN echo -e '#!/bin/bash\nls -lah' > /usr/bin/ll && \
    chmod +x /usr/bin/ll

RUN npm install -g @ionic/cli

USER nodeuser

CMD ["tail", "-f"]

WORKDIR /var/www/html/ionic5/
