import { z } from "zod";
import { fabPresentationCatalog } from "@tcg/flesh-and-blood-cards/presentation-catalog";
import { FAB_PRESENTATION_CATALOG } from "@tcg/flesh-and-blood-cards/presentation-revision";
import { selectFabPresentationRecords } from "@tcg/flesh-and-blood-cards/presentation";
import { loadFleshAndBloodStructuredCards } from "@tcg/flesh-and-blood-cards/runtime-registry";
import type { GamePresentationAdapter } from "@tcg/shared/game-adapter";
import {
  PresentationBundleSchema,
  PresentationRecordsSchema,
  type PresentationCatalogReference,
  type PresentationRecords,
} from "@tcg/protocol/presentation";

let currentCatalog: PresentationRecords | undefined;
const retryAfter = new Map<string, number>();
const catalogs = new Map<string, Promise<PresentationRecords>>();
const CatalogSchema = PresentationRecordsSchema.extend({
  schemaVersion: z.literal(1),
  game: z.literal("flesh-and-blood"),
});
const ObjectsSchema = z.object({
  objects: z.record(z.string(), z.object({ canonicalId: z.string() })),
});
const ResourcesSchema = z.object({ cardInstances: z.record(z.string(), z.string()) });
const WrappedStateSchema = z.object({ state: z.unknown() });

async function sha256(text: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function catalogFor(reference: PresentationCatalogReference): Promise<PresentationRecords> {
  if (
    reference.url !== `https://cdn.tcg.online/public/fab/presentation/${reference.revision}.json`
  ) {
    throw new Error("Invalid FAB catalog recovery location");
  }
  if (reference.revision === FAB_PRESENTATION_CATALOG.revision)
    return (currentCatalog ??= CatalogSchema.parse(fabPresentationCatalog));
  if ((retryAfter.get(reference.revision) ?? Infinity) <= Date.now()) {
    catalogs.delete(reference.revision);
    retryAfter.delete(reference.revision);
  }
  let pending = catalogs.get(reference.revision);
  if (!pending) {
    pending = (async () => {
      const response = await fetch(reference.url, { signal: AbortSignal.timeout(2_000) });
      if (!response.ok) throw new Error(`FAB catalog recovery failed: ${response.status}`);
      const bytes = await response.text();
      if ((await sha256(bytes)) !== reference.revision)
        throw new Error("FAB catalog hash mismatch");
      return CatalogSchema.parse(JSON.parse(bytes));
    })();
    catalogs.set(reference.revision, pending);
    pending.catch(() => retryAfter.set(reference.revision, Date.now() + 30_000));
  }
  return pending;
}

export const fleshAndBloodPresentationAdapter: GamePresentationAdapter = {
  async prepare(inputs) {
    const entries = inputs.flatMap((input) => input.deck);
    const definitions = await loadFleshAndBloodStructuredCards(
      entries.map((entry) => entry.cardId),
    );
    const references = [
      ...entries.map((entry) => entry.cardId),
      ...definitions.keys(),
      ...[...definitions.values()].map((card) => card.canonicalId),
    ];
    const selected = PresentationRecordsSchema.parse(
      selectFabPresentationRecords(
        fabPresentationCatalog,
        references,
        entries.flatMap((entry) => (entry.printingId ? [entry.printingId] : [])),
      ),
    );
    // Explicit runtime aliases belong to the closed authored program, never guessed names.
    for (const [alias, card] of definitions) {
      if (selected.records[card.canonicalId]) selected.aliases[alias] = card.canonicalId;
    }
    const body = { schemaVersion: 1, catalog: FAB_PRESENTATION_CATALOG, ...selected };
    return PresentationBundleSchema.parse({
      ...body,
      manifestId: await sha256(JSON.stringify(body)),
    });
  },
  collectReferences(state, cardsMaps) {
    const wrapped = WrappedStateSchema.safeParse(state);
    const parsed = ObjectsSchema.safeParse(state);
    const objects = parsed.success
      ? parsed
      : ObjectsSchema.safeParse(wrapped.success ? wrapped.data.state : undefined);
    return [
      ...new Set([
        ...Object.values(cardsMaps.cardInstances),
        ...(objects.success
          ? Object.values(objects.data.objects).map((object) => object.canonicalId)
          : []),
      ]),
    ];
  },
  async resolve(reference, references, printingIds) {
    return PresentationRecordsSchema.parse(
      selectFabPresentationRecords(await catalogFor(reference), references, printingIds),
    );
  },
  projectBindings(_state, resources, cardsMaps, viewer) {
    const visible = ResourcesSchema.safeParse(resources);
    const bindings = cardsMaps.presentation;
    return {
      printingIdByInstanceId: Object.fromEntries(
        Object.entries(bindings?.printingIdByInstanceId ?? {}).filter(
          ([id]) =>
            viewer.role === "replay" ||
            (visible.success && Object.hasOwn(visible.data.cardInstances, id)),
        ),
      ),
      ...(bindings?.printingIdBySetupSlotByOwnerId
        ? {
            printingIdBySetupSlotByOwnerId: Object.fromEntries(
              Object.entries(bindings.printingIdBySetupSlotByOwnerId).filter(
                ([id]) =>
                  viewer.role === "replay" || (viewer.role === "player" && viewer.actorId === id),
              ),
            ),
          }
        : {}),
    };
  },
};
