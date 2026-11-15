#!/usr/bin/env bash
# stop-all.sh - Gracefully terminate UERANSIM UE and gNB processes
echo "Stopping UERANSIM processes..."
sudo pkill -SIGINT nr-ue || sudo pkill -9 nr-ue || true
sudo pkill -SIGINT nr-gnb || sudo pkill -9 nr-gnb || true
echo "UERANSIM processes stopped."
