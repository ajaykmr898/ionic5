FROM node:12

RUN useradd -ms /bin/bash nodeuser
RUN usermod -aG node nodeuser

RUN echo -e '#!/bin/bash\nls -lah' > /usr/bin/ll && \
    chmod +x /usr/bin/ll

RUN npm install -g @angular/cli

RUN npm install -g @ionic/cli

USER nodeuser

CMD ["tail", "-f"]

VOLUME //c/Users/ajay.ce.kumar/Documents/repos/ionic5

WORKDIR /var/www/html/ionic5/
