import { z } from "zod";

const id = z.string().min(1);
const digest = z.string().regex(/^[a-f0-9]{64}$/);
const imageUrl = z.url().refine((value) => value.startsWith("https://"), "HTTPS image required");

export const PrintingPresentationSchema = z
  .object({
    locale: id,
    artId: id.optional(),
    boardImageUrl: imageUrl.optional(),
    printedImageUrl: imageUrl.optional(),
  })
  .strict()
  .refine(
    (value) => Boolean(value.boardImageUrl) === Boolean(value.printedImageUrl),
    "An appearance must contain both image roles or explicitly neither",
  );

export const CardPresentationSchema = z
  .object({
    canonicalId: id,
    slug: id,
    name: id,
    defaultPrintingId: id.optional(),
    boardImageUrl: imageUrl.optional(),
    printedImageUrl: imageUrl.optional(),
    printings: z.record(id, PrintingPresentationSchema),
    imageAspectRatio: z.number().positive().finite(),
    keywords: z.array(z.string()),
    faces: z.record(id, id).optional(),
  })
  .strict();

export const PresentationRecordsSchema = z
  .object({
    records: z.record(id, CardPresentationSchema),
    aliases: z.record(id, id),
  })
  .strict();

export const PresentationCatalogReferenceSchema = z
  .object({
    revision: digest,
    url: imageUrl,
  })
  .strict();

export const PresentationBundleSchema = PresentationRecordsSchema.extend({
  schemaVersion: z.literal(1),
  manifestId: digest,
  catalog: PresentationCatalogReferenceSchema,
}).strict();

/** Same overlay used by CardsMaps; these bindings replace, never accumulate. */
export const PresentationBindingsSchema = z
  .object({
    printingIdByInstanceId: z.record(id, id),
    printingIdBySetupSlotByOwnerId: z.record(id, z.record(id, id)).optional(),
  })
  .strict();

/** Stored once with a committed state, independently of viewer projections. */
export const PresentationCommitSchema = z
  .object({
    manifestId: digest,
    supplements: PresentationRecordsSchema,
  })
  .strict();

export const PresentationEnvelopeSchema = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("full"),
      bundle: PresentationBundleSchema,
      supplements: PresentationRecordsSchema,
      bindings: PresentationBindingsSchema,
    })
    .strict(),
  z
    .object({
      kind: z.literal("reference"),
      manifestId: digest,
      supplements: PresentationRecordsSchema,
      bindings: PresentationBindingsSchema,
    })
    .strict(),
]);

export type CardPresentation = z.infer<typeof CardPresentationSchema>;
export type PresentationRecords = z.infer<typeof PresentationRecordsSchema>;
export type PresentationCatalogReference = z.infer<typeof PresentationCatalogReferenceSchema>;
export type PresentationBundle = z.infer<typeof PresentationBundleSchema>;
export type PresentationBindings = z.infer<typeof PresentationBindingsSchema>;
export type PresentationCommit = z.infer<typeof PresentationCommitSchema>;
export type PresentationEnvelope = z.infer<typeof PresentationEnvelopeSchema>;

export function emptyPresentationRecords(): PresentationRecords {
  return { records: {}, aliases: {} };
}

/** Immutable records may be repeated but never silently replaced. */
export function mergePresentationRecords(
  previous: PresentationRecords,
  incoming: PresentationRecords,
): PresentationRecords {
  const records = { ...previous.records };
  for (const [key, value] of Object.entries(incoming.records)) {
    const existing = previous.records[key];
    if (existing) {
      const { printings: oldPrintings, ...oldCard } = existing;
      const { printings: newPrintings, ...newCard } = value;
      if (stablePresentationJson(oldCard) !== stablePresentationJson(newCard)) {
        throw new Error(`Conflicting presentation record: ${key}`);
      }
      for (const [printingId, printing] of Object.entries(newPrintings)) {
        if (
          oldPrintings[printingId] &&
          stablePresentationJson(oldPrintings[printingId]) !== stablePresentationJson(printing)
        ) {
          throw new Error(`Conflicting presentation printing: ${printingId}`);
        }
      }
      records[key] = { ...existing, printings: { ...oldPrintings, ...newPrintings } };
    } else {
      records[key] = value;
    }
    if (value.canonicalId !== key) throw new Error(`Invalid presentation record key: ${key}`);
  }
  for (const [key, value] of Object.entries(incoming.aliases)) {
    if (previous.aliases[key] && previous.aliases[key] !== value) {
      throw new Error(`Conflicting presentation alias: ${key}`);
    }
  }
  return {
    records,
    aliases: { ...previous.aliases, ...incoming.aliases },
  };
}

/** Canonical object ordering; array order and explicit null remain meaningful. */
export function stablePresentationJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stablePresentationJson).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.entries(value)
      .filter(([, entry]) => entry !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stablePresentationJson(entry)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}
