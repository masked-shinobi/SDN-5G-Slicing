#!/usr/bin/env bash
# start-ue.sh - Launch UERANSIM UE with dual slice registration
set -e

UERANSIM_DIR="${UERANSIM_DIR:-$HOME/UERANSIM}"
CONFIG_FILE="${UERANSIM_DIR}/config/open5gs-ue.yaml"

echo "Starting UERANSIM nr-ue (IMSI: 999700000000001)..."
sudo pkill -9 nr-ue || true
sudo "$UERANSIM_DIR/build/nr-ue" -c "$CONFIG_FILE"
