#!/usr/bin/env bash
# start-gnb.sh - Launch UERANSIM gNodeB
set -e

UERANSIM_DIR="${UERANSIM_DIR:-$HOME/UERANSIM}"
CONFIG_FILE="${UERANSIM_DIR}/config/open5gs-gnb.yaml"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "Warning: $CONFIG_FILE not found, checking local configs..."
fi

echo "Starting UERANSIM nr-gnb..."
sudo pkill -9 nr-gnb || true
sudo "$UERANSIM_DIR/build/nr-gnb" -c "$CONFIG_FILE"
