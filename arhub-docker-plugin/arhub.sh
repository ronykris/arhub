#!/bin/bash

# Check if exactly two parameters are provided
if [ $# -ne 2 ]; then
    echo "Usage: $0 <command> <image>"
    exit 1
fi

# Store the two parameters in variables
cmd="$1"
img="$2"
CWD=$(pwd)
echo $CWD

if [ "$cmd" = "pull" ]; then
    docker run -v "$CWD:/app/img" -it arhubpull "$img"
    TARFILE=$(ls |grep tar)
    docker load -i "$CWD/$TARFILE"
    rm -rf $TARFILE
elif [ "$cmd" = "push" ]; then
    docker save -o "$CWD/$img.tar" "$img"
    docker run -v "$CWD:/app/img" -it arhubpush:latest "img/$img.tar"
    TARFILE=$(ls |grep tar)
    rm -rf $TARFILE
else
    echo "Invalid command: $cmd"
    exit 1
fi

