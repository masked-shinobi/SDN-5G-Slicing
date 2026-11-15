#!/usr/bin/env bash
# start-core.sh - Restart Open5GS daemons and configure secondary tunnel
set -e

echo "Restarting Open5GS 5G Core services..."
sudo systemctl restart mongod
sudo systemctl restart open5gs-nrfd open5gs-udrd open5gs-udmd open5gs-ausfd open5gs-nssfd open5gs-pcfd open5gs-amfd open5gs-smfd open5gs-upfd

# Ensure ogstun2 secondary interface exists for Slice B (10.46.0.0/24)
if ! ip link show ogstun2 &> /dev/null; then
    echo "Creating ogstun2 interface for Slice B..."
    sudo ip tuntap add name ogstun2 mode tun
    sudo ip addr add 10.46.0.1/24 dev ogstun2
    sudo ip link set ogstun2 up
    sudo iptables -t nat -A POSTROUTING -s 10.46.0.0/24 ! -o ogstun2 -j MASQUERADE
fi

echo "Open5GS 5G Core is up and running."
