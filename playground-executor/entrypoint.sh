#!/bin/bash

set -xe

export JAILDIR=$WORKDIR/jail
rm -rf $JAILDIR

mkdir -p $JAILDIR/{dev,lib,bin,etc,tmp,proc,sys,usr/local/go}

cp /lib/ld-musl-x86_64.so.1 $JAILDIR/lib/

echo "hosts: files dns" > $JAILDIR/etc/nsswitch.conf

mount -t tmpfs -o size=100m tmpfs $JAILDIR/tmp

mount -o ro,bind /usr/local/go $JAILDIR/usr/local/go

mkdir -p $JAILDIR/dev

mknod -m 666 $JAILDIR/dev/null c 1 3
mknod -m 666 $JAILDIR/dev/zero c 1 5
mknod -m 666 $JAILDIR/dev/random c 1 8
mknod -m 666 $JAILDIR/dev/urandom c 1 9

mount -t proc proc $JAILDIR/proc
# mount -t sysfs sysfs $JAILDIR/sys

touch $JAILDIR/etc/resolv.conf
mount -o ro,bind /etc/resolv.conf $JAILDIR/etc/resolv.conf

cp /app/bin/go-playground-executor $JAILDIR/bin/
chown playground:playground $JAILDIR/bin/go-playground-executor
chmod +x $JAILDIR/bin/go-playground-executor

chroot $JAILDIR \
	/bin/go-playground-executor
