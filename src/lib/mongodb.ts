import { MongoClient, Db } from "mongodb";
import { Open5gsSubscriber, SliceItem } from "./subscriber-schema";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/open5gs";
const DB_NAME = "open5gs";
const SUBSCRIBERS_COLLECTION = "subscribers";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * In-memory fallback subscriber store initialized with Slice A & Slice B
 */
const mockSubscriberStore: Open5gsSubscriber = {
  imsi: "999700000000001",
  plmn: {
    mcc: "999",
    mnc: "70",
  },
  security: {
    k: "465B5CE8B199B49FAA5F0A2EE238A6BC",
    opc: "E8ED289DEBA952E4283B54E88E6183CA",
    amf: "8000",
    sqn: "000000000000",
  },
  slices: [
    {
      sst: 1,
      sd: "000001",
      dnn: "internet",
      default_indicator: true,
      ipPool: "10.45.0.0/24",
      ambrDownlink: "1 Gbps",
      ambrUplink: "500 Mbps",
      fiveQi: 9,
    },
    {
      sst: 2,
      sd: "000002",
      dnn: "internet2",
      default_indicator: false,
      ipPool: "10.46.0.0/24",
      ambrDownlink: "100 Mbps",
      ambrUplink: "50 Mbps",
      fiveQi: 1,
    },
  ],
  updatedAt: new Date().toISOString(),
};

/**
 * Connect to MongoDB or return null if daemon is not running
 */
export async function getMongoDb(): Promise<Db | null> {
  if (cachedDb) return cachedDb;

  try {
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 1500,
      connectTimeoutMS: 2000,
    });
    await client.connect();
    cachedClient = client;
    cachedDb = client.db(DB_NAME);
    return cachedDb;
  } catch {
    // MongoDB daemon not available in local environment; fallback seamlessly
    return null;
  }
}

/**
 * Get subscriber by IMSI
 */
export async function getSubscriber(imsi: string = "999700000000001"): Promise<Open5gsSubscriber> {
  const db = await getMongoDb();

  if (db) {
    try {
      const doc = await db.collection(SUBSCRIBERS_COLLECTION).findOne({ imsi });
      if (doc) {
        // Map Open5GS document schema to our UI schema
        const slices: SliceItem[] = (doc.slice || []).map((s: any) => ({
          sst: s.sst,
          sd: s.sd ? String(s.sd).padStart(6, "0").toUpperCase() : "000000",
          default_indicator: !!s.default_indicator,
          dnn: s.session?.[0]?.name || "internet",
          ipPool: s.session?.[0]?.name === "internet2" ? "10.46.0.0/24" : "10.45.0.0/24",
          ambrDownlink: "1 Gbps",
          ambrUplink: "500 Mbps",
          fiveQi: s.session?.[0]?.qos?.index || 9,
        }));

        return {
          imsi: doc.imsi,
          plmn: { mcc: "999", mnc: "70" },
          security: {
            k: doc.security?.k || "465B5CE8B199B49FAA5F0A2EE238A6BC",
            opc: doc.security?.opc || "E8ED289DEBA952E4283B54E88E6183CA",
            amf: doc.security?.amf || "8000",
            sqn: doc.security?.sqn || "000000000000",
          },
          slices: slices.length > 0 ? slices : mockSubscriberStore.slices,
          updatedAt: new Date().toISOString(),
        };
      }
    } catch {
      // Fallback on error
    }
  }

  return { ...mockSubscriberStore };
}

/**
 * Add or update slice for subscriber
 */
export async function addSliceToSubscriber(imsi: string, newSlice: SliceItem): Promise<Open5gsSubscriber> {
  const db = await getMongoDb();

  if (db) {
    try {
      const open5gsSliceObj = {
        sst: newSlice.sst,
        sd: newSlice.sd,
        default_indicator: newSlice.default_indicator,
        session: [
          {
            name: newSlice.dnn,
            type: 1, // IPv4
            puaa: {
              ip: newSlice.ipPool ? newSlice.ipPool.split("/")[0] : undefined,
            },
            qos: {
              index: newSlice.fiveQi,
              arp: { priority_level: 8, pre_emption_capability: 1, pre_emption_vulnerability: 1 },
            },
            ambr: {
              downlink: { value: 1, unit: 3 },
              uplink: { value: 1, unit: 3 },
            },
          },
        ],
      };

      await db.collection(SUBSCRIBERS_COLLECTION).updateOne(
        { imsi },
        {
          $pull: { slice: { sst: newSlice.sst, sd: newSlice.sd } as any },
        }
      );

      await db.collection(SUBSCRIBERS_COLLECTION).updateOne(
        { imsi },
        {
          $push: { slice: open5gsSliceObj as any },
        },
        { upsert: true }
      );
    } catch {
      // Fallback to in-memory store
    }
  }

  // Update in-memory fallback
  const existingIdx = mockSubscriberStore.slices.findIndex(
    (s) => s.sst === newSlice.sst && s.sd.toUpperCase() === newSlice.sd.toUpperCase()
  );

  if (existingIdx >= 0) {
    mockSubscriberStore.slices[existingIdx] = newSlice;
  } else {
    mockSubscriberStore.slices.push(newSlice);
  }

  mockSubscriberStore.updatedAt = new Date().toISOString();
  return { ...mockSubscriberStore };
}

/**
 * Remove slice from subscriber
 */
export async function removeSliceFromSubscriber(imsi: string, sst: number, sd: string): Promise<Open5gsSubscriber> {
  const db = await getMongoDb();

  if (db) {
    try {
      await db.collection(SUBSCRIBERS_COLLECTION).updateOne(
        { imsi },
        {
          $pull: { slice: { sst, sd } as any },
        }
      );
    } catch {
      // Fallback
    }
  }

  // Update in-memory fallback
  mockSubscriberStore.slices = mockSubscriberStore.slices.filter(
    (s) => !(s.sst === sst && s.sd.toUpperCase() === sd.toUpperCase())
  );

  mockSubscriberStore.updatedAt = new Date().toISOString();
  return { ...mockSubscriberStore };
}
