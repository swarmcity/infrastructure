FROM nginx
LABEL maintainer="email@drageth.com"

RUN apt-get update \
  && apt-get -f install \
  && apt-get install cron wget curl python-pip -y

RUN wget https://dl.eff.org/certbot-auto
RUN chmod a+x ./certbot-auto

RUN /certbot-auto --non-interactive plugins
RUN . /opt/eff.org/certbot/venv/bin/activate \
  && pip install certbot-dns-nsone

RUN mkdir -p /data/nginx/cache /etc/nginx/sites-enabled/ /etc/nginx/sites-available/
RUN ln -s /etc/nginx/sites-available/site /etc/nginx/sites-enabled/
RUN ln -s /etc/nginx/sites-available/api /etc/nginx/sites-enabled/
RUN openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
RUN chown -R www-data:www-data /data


COPY nginx.conf /etc/nginx/nginx.conf
COPY ssl-params.conf /etc/nginx/snippets/ssl-params.conf
COPY site /etc/nginx/sites-available/site
COPY api /etc/nginx/sites-available/api
COPY startup startup

VOLUME ["/etc/nginx/ssl"]

ENTRYPOINT /startup
EXPOSE 80 443
