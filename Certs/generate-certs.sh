#!/bin/bash

set -e

generate_certs() {
  echo -e "Generating cert for domain: $1 ... " >> /var/log/cron.log
  chmod 640 /nsone.ini
  if [ "${DEBUG}" == "Disable" ]; then
    /certbot-auto certonly --dns-nsone \
      --dns-nsone-credentials /nsone.ini \
      --dns-nsone-propagation-seconds 60 \
      --non-interactive \
      --no-bootstrap \
      --agree-tos \
      --email email@drageth.com \
      -d $1
  else
    echo -e "Debug is enabled ... " >> /var/log/cron.log
    /certbot-auto certonly --dns-nsone \
      --dns-nsone-credentials /nsone.ini \
      --dns-nsone-propagation-seconds 60 \
      --non-interactive \
      --no-bootstrap \
      --agree-tos \
      --email email@drageth.com \
      --server https://acme-staging.api.letsencrypt.org/directory \
      -d $1
  fi
  mkdir -p /etc/letsencrypt/nginx-certs
  cp -Lr /etc/letsencrypt/live/$1 /etc/letsencrypt/nginx-certs/ 
}

if [[ -f "/etc/letsencrypt/live/${SITE_HOSTNAME}/fullchain.pem"
      && -f "/etc/letsencrypt/live/${SITE_HOSTNAME}/privkey.pem" ]]; then
  echo -e "Certs already exist for domain : ${SITE_HOSTNAME}" >> /var/log/cron.log
else
  generate_certs ${SITE_HOSTNAME}
fi

if [[ -f "/etc/letsencrypt/live/${API_HOSTNAME}/fullchain.pem"
      && -f "/etc/letsencrypt/live/${API_HOSTNAME}/privkey.pem" ]]; then
  echo -e "Certs already exist for domain : ${API_HOSTNAME}" >> /var/log/cron.log
else
  generate_certs ${API_HOSTNAME}
fi

