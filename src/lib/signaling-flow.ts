export interface FlowStep {
  stepNumber: number;
  title: string;
  source: string;
  target: string;
  referencePoint: string;
  protocol: string;
  summary: string;
  description: string;
  informationElements: {
    name: string;
    value: string;
    highlight?: boolean;
  }[];
  specReference: string;
}

export const SIGNALING_STEPS: FlowStep[] = [
  {
    stepNumber: 1,
    title: "NAS Registration Request with Requested NSSAI",
    source: "UE",
    target: "gNodeB",
    referencePoint: "N1 (RRC)",
    protocol: "3GPP TS 24.501 (NAS-5GS) / TS 38.331 (RRC)",
    summary: "UE transmits registration message containing its requested network slices",
    description:
      "Upon powering on, the simulated UE (IMSI 999700000000001) establishes an RRC connection with the gNodeB and includes the Requested NSSAI in the initial NAS Registration Request.",
    informationElements: [
      { name: "5GS Registration Type", value: "Initial Registration" },
      { name: "5GS Mobile Identity (SUCI)", value: "imsi-999700000000001" },
      {
        name: "Requested NSSAI",
        value: "[SST: 1, SD: 000001] (eMBB), [SST: 2, SD: 000002] (URLLC)",
        highlight: true,
      },
      { name: "UE Security Capabilities", value: "5G-EA0, 5G-IA1, 5G-IA2 (128-bit)" },
    ],
    specReference: "3GPP TS 23.502 §4.2.2.2.2 (Step 1)",
  },
  {
    stepNumber: 2,
    title: "NGAP Initial UE Message Transfer",
    source: "gNodeB",
    target: "AMF",
    referencePoint: "N2 (NGAP/SCTP)",
    protocol: "3GPP TS 38.413 (NGAP)",
    summary: "gNodeB routes the NAS message to Open5GS AMF over SCTP port 38412",
    description:
      "The gNodeB inspects the RRC establishment cause, encapsulates the NAS PDU in an NGAP InitialUEMessage, and forwards it to the Open5GS AMF daemon.",
    informationElements: [
      { name: "RAN UE NGAP ID", value: "1" },
      { name: "User Location Information (NR CGI)", value: "PLMN 999/70, Cell ID: 1" },
      { name: "Selected PLMN ID", value: "MCC 999, MNC 70" },
      {
        name: "RRC Establishment Cause",
        value: "mo-Signalling (Mobile Originated Signalling)",
      },
    ],
    specReference: "3GPP TS 38.413 §8.6.1",
  },
  {
    stepNumber: 3,
    title: "UDM/UDR Subscription Check & S-NSSAI Authorization",
    source: "AMF",
    target: "UDM / MongoDB",
    referencePoint: "N8 / N10",
    protocol: "3GPP TS 29.503 (Nudm_SDM)",
    summary: "AMF queries MongoDB to verify if requested slices are subscribed",
    description:
      "The AMF validates the subscriber's credentials via AUSF and queries the UDM/UDR (Open5GS MongoDB subscribers collection) to retrieve the Subscribed S-NSSAI list.",
    informationElements: [
      { name: "Subscriber IMSI", value: "999700000000001" },
      {
        name: "Subscribed S-NSSAIs in DB",
        value: "[SST: 1, SD: 000001], [SST: 2, SD: 000002]",
        highlight: true,
      },
      { name: "Default S-NSSAI", value: "SST: 1, SD: 000001 (Slice A)" },
      { name: "Access and Mobility Subscription", value: "Authorized (PLMN 999/70)" },
    ],
    specReference: "3GPP TS 23.502 §4.2.2.2.2 (Step 9b)",
  },
  {
    stepNumber: 4,
    title: "NAS Registration Accept with Allowed NSSAI",
    source: "AMF",
    target: "UE",
    referencePoint: "N1 (NAS-5GS)",
    protocol: "3GPP TS 24.501 (NAS)",
    summary: "AMF informs UE which network slices have been authorized",
    description:
      "The AMF dispatches the NAS Registration Accept. The payload contains the Allowed NSSAI, confirming both Slice A (eMBB) and Slice B (URLLC) are permitted in this PLMN.",
    informationElements: [
      { name: "5GS Registration Result", value: "3GPP Access (Success)" },
      { name: "5G-GUTI Assigned", value: "99970-01-01-00000001" },
      {
        name: "Allowed NSSAI (Granted)",
        value: "[SST: 1, SD: 000001], [SST: 2, SD: 000002]",
        highlight: true,
      },
      { name: "Rejected NSSAI", value: "None (All requested slices authorized)" },
    ],
    specReference: "3GPP TS 23.502 §4.2.2.2.2 (Step 21)",
  },
  {
    stepNumber: 5,
    title: "Dual PDU Session Establishment Requests",
    source: "UE",
    target: "SMF",
    referencePoint: "N1 / N11",
    protocol: "3GPP TS 24.501 (5GSM)",
    summary: "UE initiates separate PDU sessions for each authorized slice",
    description:
      "The UE triggers two distinct PDU Session Establishment requests: Session 1 requesting DNN 'internet' for Slice A, and Session 2 requesting DNN 'internet2' for Slice B.",
    informationElements: [
      {
        name: "PDU Session ID 1",
        value: "S-NSSAI [SST: 1, SD: 000001] -> DNN: internet",
        highlight: true,
      },
      {
        name: "PDU Session ID 2",
        value: "S-NSSAI [SST: 2, SD: 000002] -> DNN: internet2",
        highlight: true,
      },
      { name: "PDU Session Type", value: "IPv4" },
      { name: "SSC Mode", value: "SSC Mode 1 (Session and Service Continuity)" },
    ],
    specReference: "3GPP TS 23.502 §4.3.2.2.1 (Step 1)",
  },
  {
    stepNumber: 6,
    title: "N4 Session Establishment & UPF Tunnel Binding",
    source: "SMF",
    target: "UPF",
    referencePoint: "N4 (PFCP)",
    protocol: "3GPP TS 29.244 (PFCP) / GTP-U",
    summary: "UPF creates dedicated tunnels uesimtun0 & uesimtun1 with isolated subnets",
    description:
      "The SMF programs the UPF via PFCP over reference point N4. The UPF allocates dedicated IP addresses from separate IP pools and binds them to distinct virtual tunnel interfaces.",
    informationElements: [
      {
        name: "Slice A Tunnel",
        value: "Interface: uesimtun0 | IP: 10.45.0.2 (Pool 10.45.0.0/24)",
        highlight: true,
      },
      {
        name: "Slice B Tunnel",
        value: "Interface: uesimtun1 | IP: 10.46.0.2 (Pool 10.46.0.0/24)",
        highlight: true,
      },
      { name: "GTP-U TEID Downlink", value: "Session 1: 0x0001 | Session 2: 0x0002" },
      { name: "Status", value: "End-to-End User Plane Slices Active" },
    ],
    specReference: "3GPP TS 23.502 §4.3.2.2.1 (Step 10)",
  },
];
