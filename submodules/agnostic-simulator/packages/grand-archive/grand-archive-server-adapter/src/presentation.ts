import {
  grandArchiveAssetCatalog,
  grandArchivePresentationReference,
  getGrandArchiveCard,
} from "@tcg/grand-archive-cards";
import {
  PresentationCatalogReferenceSchema,
  PresentationRecordsSchema,
  type PresentationCatalogReference,
  type PresentationRecords,
} from "@tcg/protocol/presentation";
import type { CardsMaps } from "@tcg/shared/game-adapter";

export interface GrandArchiveArtPin {
  catalog: PresentationCatalogReference;
  printingIdByObjectId: Record<string, string>;
}
export interface GrandArchiveFrozenArt extends GrandArchiveArtPin {
  records: PresentationRecords;
}
const records = PresentationRecordsSchema.parse({
  records: grandArchiveAssetCatalog.records,
  aliases: grandArchiveAssetCatalog.aliases,
});
export function currentGrandArchiveArt(): GrandArchiveFrozenArt {
  return { catalog: grandArchivePresentationReference, records, printingIdByObjectId: {} };
}
export function parseGrandArchiveArtPin(value: unknown): GrandArchiveArtPin {
  if (
    !value ||
    typeof value !== "object" ||
    !("catalog" in value) ||
    !("printingIdByObjectId" in value)
  )
    throw new Error("Invalid Grand Archive art pin");
  const catalog = PresentationCatalogReferenceSchema.parse(value.catalog);
  if (
    catalog.url !==
    `https://cdn.tcg.online/public/grand-archive/presentation/${catalog.revision}.json`
  )
    throw new Error("Invalid Grand Archive catalog URL");
  const bindings = value.printingIdByObjectId;
  if (!bindings || typeof bindings !== "object" || Array.isArray(bindings))
    throw new Error("Invalid printing bindings");
  const printingIdByObjectId: Record<string, string> = {};
  for (const [id, printing] of Object.entries(bindings)) {
    if (typeof printing !== "string" || !printing) throw new Error("Invalid printing binding");
    printingIdByObjectId[id] = printing;
  }
  return { catalog, printingIdByObjectId };
}
export async function restoreGrandArchiveArt(value: unknown): Promise<GrandArchiveFrozenArt> {
  if (value === undefined) return currentGrandArchiveArt(); // Pre-migration snapshots have no frozen art.
  const pin = parseGrandArchiveArtPin(value);
  if (pin.catalog.revision === grandArchivePresentationReference.revision)
    return { ...pin, records };
  const response = await fetch(pin.catalog.url, {
    signal: AbortSignal.timeout(10_000),
    redirect: "error",
  });
  if (!response.ok)
    throw new Error(`Historical Grand Archive catalog unavailable: ${response.status}`);
  const bytes = await response.text();
  const digest = [
    ...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(bytes))),
  ]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  if (digest !== pin.catalog.revision)
    throw new Error("Historical Grand Archive catalog hash mismatch");
  const parsed = PresentationRecordsSchema.loose().parse(JSON.parse(bytes));
  for (const card of Object.values(parsed.records))
    for (const p of Object.values(card.printings)) {
      if (
        !p.printedImageUrl ||
        !p.boardImageUrl ||
        !/^https:\/\/cdn\.tcg\.online\/public\/grand-archive\/assets\/(?:board|full)\/[a-f0-9]{64}\.webp$/.test(
          p.boardImageUrl,
        ) ||
        !/^https:\/\/cdn\.tcg\.online\/public\/grand-archive\/assets\/full\/[a-f0-9]{64}\.webp$/.test(
          p.printedImageUrl,
        )
      )
        throw new Error("Invalid retained Grand Archive image");
    }
  return { ...pin, records: { records: parsed.records, aliases: parsed.aliases } };
}
function pinnedAppearance(art: GrandArchiveFrozenArt, definitionId: string, objectId?: string) {
  const canonicalId = getGrandArchiveCard(definitionId)?.canonicalId ?? definitionId;
  const record = art.records.records[canonicalId];
  if (!record) return undefined;
  let printing = objectId ? art.printingIdByObjectId[objectId] : undefined;
  if (printing && !record.printings[printing]) {
    const source = Object.values(art.records.records).find((c) => c.printings[printing!]);
    printing = source?.faces?.[`${printing}:${canonicalId}`];
    if (!printing) return undefined;
  }
  const appearance = record.printings[printing ?? record.defaultPrintingId ?? ""];
  return appearance ? { appearance, defaultBoardAspectRatio: record.imageAspectRatio } : undefined;
}
export function grandArchivePinnedImage(
  art: GrandArchiveFrozenArt,
  definitionId: string,
  objectId?: string,
  role: "board" | "printed" = "printed",
): string | undefined {
  return pinnedAppearance(art, definitionId, objectId)?.appearance[
    role === "board" ? "boardImageUrl" : "printedImageUrl"
  ];
}
export function grandArchivePinnedImageAspectRatio(
  art: GrandArchiveFrozenArt,
  definitionId: string,
  objectId?: string,
  role: "board" | "printed" = "printed",
): number | undefined {
  const selected = pinnedAppearance(art, definitionId, objectId);
  if (!selected) return undefined;
  return role === "board"
    ? (selected.appearance.boardImageAspectRatio ?? selected.defaultBoardAspectRatio)
    : (selected.appearance.printedImageAspectRatio ?? 5 / 7);
}
export function bindGrandArchiveArt(
  art: GrandArchiveFrozenArt,
  maps: CardsMaps,
  objects: Record<string, { id: string; ownerId: string; definitionId: string }>,
): void {
  const queues = new Map<string, string[]>();
  for (const [owner, ids] of Object.entries(maps.owners))
    for (const id of ids) {
      if (["side", "sideboard"].includes(maps.instanceSections?.[id] ?? "")) continue;
      const definitionId = maps.cardInstances[id];
      if (!definitionId) continue;
      const card = getGrandArchiveCard(definitionId);
      if (!card) continue;
      const printing =
        maps.presentation?.printingIdByInstanceId[id] ??
        art.records.records[card.canonicalId]?.defaultPrintingId;
      if (!printing || !art.records.records[card.canonicalId]?.printings[printing])
        throw new Error(`Invalid selected printing for ${card.canonicalId}`);
      const key = `${owner}:${card.canonicalId}`;
      const queue = queues.get(key) ?? [];
      queue.push(printing);
      queues.set(key, queue);
    }
  for (const object of Object.values(objects)) {
    const id = getGrandArchiveCard(object.definitionId)?.canonicalId ?? object.definitionId;
    const printing = queues.get(`${object.ownerId}:${id}`)?.shift();
    if (printing) art.printingIdByObjectId[object.id] = printing;
  }
}
