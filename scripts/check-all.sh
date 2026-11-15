#!/usr/bin/env bash
# check-all.sh - Runs Table A1 health checklist and outputs PASS/FAIL per line

echo "=== 5G Slicing Backend Health Verification ==="

check_cmd() {
    local num="$1"
    local desc="$2"
    local cmd="$3"
    local expected="$4"

    local output
    output=$(eval "$cmd" 2>/dev/null || true)

    if [[ "$output" =~ $expected ]]; then
        echo -e "[$num] PASS - $desc"
    else
        echo -e "[$num] FAIL - $desc (got: '$output', expected: '$expected')"
    fi
}

check_cmd 1 "MongoDB up" "systemctl is-active mongod" "active"
check_cmd 2 "AMF up" "systemctl is-active open5gs-amfd" "active"
check_cmd 2 "SMF up" "systemctl is-active open5gs-smfd" "active"
check_cmd 2 "UPF up" "systemctl is-active open5gs-upfd" "active"
check_cmd 3 "Slices in AMF config" "grep -A8 plmn_support /etc/open5gs/amf.yaml" "000001"
check_cmd 8 "Slice A interface (uesimtun0)" "ip addr show uesimtun0" "10.45.0."
check_cmd 8 "Slice B interface (uesimtun1)" "ip addr show uesimtun1" "10.46.0."
check_cmd 9 "Traffic Slice A (uesimtun0)" "ping -I uesimtun0 -c 2 8.8.8.8" "0% packet loss"
check_cmd 9 "Traffic Slice B (uesimtun1)" "ping -I uesimtun1 -c 2 8.8.8.8" "0% packet loss"

echo "=== Health check complete ==="
