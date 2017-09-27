FROM nginx
LABEL maintainer="email@drageth.com"

RUN apt-get update \
  && apt-get -f install \
  && apt-get install cron wget python-pip -y

RUN wget https://dl.eff.org/certbot-auto
RUN chmod a+x ./certbot-auto

RUN /certbot-auto --non-interactive plugins
RUN . /opt/eff.org/certbot/venv/bin/activate \
  && pip install certbot-dns-nsone

COPY nsone.ini nsone.ini
COPY generate-certs.sh generate-certs.sh
COPY renew-certs renew-certs
COPY startup startup 
COPY renew-certs-cron /etc/cron.d/renew-certs-cron

RUN crontab /etc/cron.d/renew-certs-cron

ENTRYPOINT /startup

