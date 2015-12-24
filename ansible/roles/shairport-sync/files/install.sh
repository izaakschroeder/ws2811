#!/bin/sh -e

beginswith() { case $2 in $1*) true;; *) false;; esac; }

VERSION=`shairport-sync --version || echo 0`

if beginswith "2.7.4" "${VERSION}"; then
  echo "!unchanged!"
  exit 0;
fi

rm -rf /tmp/shairport-sync
cd /tmp
git clone https://github.com/mikebrady/shairport-sync.git
cd shairport-sync
git checkout development

apt-get install -y --no-install-recommends automake autoconf libtool pkg-config libdaemon0 libdaemon-dev libasound2 libasound2-dev libpopt0 libpopt-dev libconfig9 libconfig-dev libavahi-client-dev libssl-dev

autoreconf -i -f

./configure \
  --prefix=/usr \
  --with-metadata \
  --with-systemd \
  --with-avahi \
  --with-ssl=openssl \
  --with-alsa

make

make install

apt-get remove -y automake autoconf libtool pkg-config libdaemon-dev libasound2-dev libpopt-dev libconfig-dev libavahi-client-dev libssl-dev

rm -rf tmp/shairport-sync
