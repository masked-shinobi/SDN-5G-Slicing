import { z } from "zod";

/**
 * 3GPP IMSI schema (15 numeric digits)
 */
export const ImsiSchema = z
  .string()
  .regex(/^\d{15}$/, "IMSI must be exactly 15 numeric digits")
  .default("999700000000001");

/**
 * 3GPP S-NSSAI Slice Item schema
 */
export const SliceItemSchema = z.object({
  sst: z.number().int().min(1).max(255, "SST must be an integer between 1 and 255"),
  sd: z
    .string()
    .regex(/^[0-9A-Fa-f]{6}$/, "SD must be a 6-digit hexadecimal string (e.g. 000001)")
    .default("000001"),
  dnn: z.string().min(1, "DNN is required").max(64),
  default_indicator: z.boolean().default(true),
  ipPool: z.string().optional(),
  ambrDownlink: z.string().default("1 Gbps"),
  ambrUplink: z.string().default("500 Mbps"),
  fiveQi: z.number().int().min(1).max(255).default(9),
});

export type SliceItem = z.infer<typeof SliceItemSchema>;

/**
 * Schema for adding a new slice to a subscriber
 */
export const AddSliceSchema = z.object({
  imsi: ImsiSchema.default("999700000000001"),
  slice: SliceItemSchema,
});

export type AddSliceInput = z.infer<typeof AddSliceSchema>;

/**
 * Schema for removing a slice from a subscriber
 */
export const DeleteSliceSchema = z.object({
  imsi: ImsiSchema.default("999700000000001"),
  sst: z.number().int().min(1).max(255),
  sd: z.string().regex(/^[0-9A-Fa-f]{6}$/),
});

export type DeleteSliceInput = z.infer<typeof DeleteSliceSchema>;

/**
 * Full Subscriber Model schema matching Open5GS MongoDB representation
 */
export const Open5gsSubscriberSchema = z.object({
  imsi: ImsiSchema,
  plmn: z.object({
    mcc: z.string().length(3).default("999"),
    mnc: z.string().min(2).max(3).default("70"),
  }),
  security: z.object({
    k: z.string().default("465B5CE8B199B49FAA5F0A2EE238A6BC"),
    opc: z.string().default("E8ED289DEBA952E4283B54E88E6183CA"),
    amf: z.string().default("8000"),
    sqn: z.string().default("000000000000"),
  }),
  slices: z.array(SliceItemSchema),
  updatedAt: z.string().optional(),
});

export type Open5gsSubscriber = z.infer<typeof Open5gsSubscriberSchema>;
