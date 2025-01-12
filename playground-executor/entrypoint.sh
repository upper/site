#!/bin/sh

set -xe

export JAILDIR=$WORKDIR/jail

rm -rf $JAILDIR

mkdir -p $JAILDIR/usr/local/go
mkdir -p $JAILDIR/dev
mkdir -p $JAILDIR/lib

mkdir -p $JAILDIR/bin
mkdir -p $JAILDIR/tmp
mkdir -p $JAILDIR/etc

cp /app/bin/go-playground-executor $JAILDIR/bin

chown playground:playground $JAILDIR/bin/go-playground-executor
chmod +x $JAILDIR/bin/go-playground-executor

echo "hosts: files dns" > $JAILDIR/etc/nsswitch.conf

mount -o ro,bind /usr/local/go $JAILDIR/usr/local/go
mount -o ro,bind /dev $JAILDIR/dev
mount -o ro,bind /lib $JAILDIR/lib

touch $JAILDIR/etc/resolv.conf

mount -o ro,bind /etc/resolv.conf $JAILDIR/etc/resolv.conf
mount -t tmpfs -o size=100m tmpfs $JAILDIR/tmp

chroot $JAILDIR /bin/go-playground-executor
