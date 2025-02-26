#!/bin/bash

set -xe

if [ -z "$WORKDIR" ]; then
  echo "WORKDIR is not set"
  exit 1
fi

export CHROOTDIR="$WORKDIR/chroot"

rm -rf "$CHROOTDIR"

mkdir -p $CHROOTDIR/{dev,lib,bin,etc,tmp,proc,sys,go,ephemeral}

# /lib
cp /lib/ld-musl-x86_64.so.1 $CHROOTDIR/lib/

# /dev
mkdir -p $CHROOTDIR/dev
mknod -m 666 $CHROOTDIR/dev/null c 1 3
mknod -m 666 $CHROOTDIR/dev/zero c 1 5
mknod -m 666 $CHROOTDIR/dev/random c 1 8
mknod -m 666 $CHROOTDIR/dev/urandom c 1 9

# /proc
mount -t proc proc $CHROOTDIR/proc

# /sys
mount -t sysfs sysfs $CHROOTDIR/sys

# /go
mount -o ro,bind /usr/local/go $CHROOTDIR/go

# create user entries
echo "nobody:x:65534:65534:::" > $CHROOTDIR/etc/passwd
echo "nobody:x:65534:" > $CHROOTDIR/etc/group

# enable DNS resolution
echo "hosts: files dns" > $CHROOTDIR/etc/nsswitch.conf
cp /etc/resolv.conf $CHROOTDIR/etc/resolv.conf

# copy playground executor
cp /app/bin/go-playground-executor $CHROOTDIR/bin/
chown nobody:nobody $CHROOTDIR/bin/go-playground-executor
chmod +x $CHROOTDIR/bin/go-playground-executor
chmod u+s $CHROOTDIR/bin/go-playground-executor

# prepare playground
mount -t tmpfs -o defaults,size=256M,nosuid,noexec,nodev,mode=1755,uid=0,gid=0 tmpfs $CHROOTDIR/ephemeral

cp -r $WORKDIR/playground $CHROOTDIR/ephemeral/playground

chown -R root:root $CHROOTDIR/ephemeral
chmod -R 755 $CHROOTDIR/ephemeral

mkdir -p $CHROOTDIR/ephemeral/.gocache
chown nobody:nobody $CHROOTDIR/ephemeral/.gocache

mkdir -p $CHROOTDIR/ephemeral/playground/builds
mount -t tmpfs -o defaults,size=512M,nosuid,nodev,mode=1777,uid=65534,gid=65534 tmpfs $CHROOTDIR/ephemeral/playground/builds

export HOME=$WORKDIR
export PATH=/bin:/go/bin
export GOROOT=/go

unset WORKDIR
unset GOLANG_URL
unset GOPATH
unset HOME

cd $CHROOTDIR
unset CHROOTDIR

export CGO_ENABLED=0
export TMPDIR=/ephemeral/playground/builds

/usr/sbin/chroot . /bin/go-playground-executor
