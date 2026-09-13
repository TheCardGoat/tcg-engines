import { getGundamPrintingInfo } from "@tcg/gundam-cards";
import type { FilteredMatchView } from "@tcg/gundam-engine";
import type { Card } from "@tcg/gundam-types";
import type { CardsMaps } from "@tcg/shared/game-adapter";

export type GundamPresentation = NonNullable<CardsMaps["presentation"]>;

const SETUP_TOKEN_INSTANCE_PREFIX = {
  "ex-base": "ex-base-token:",
  "ex-resource": "ex-resource-token:",
} as const;

/**
 * Read a host-supplied presentation overlay from match/replay resources.
 * The engine never chooses art; this only extracts what the host already
 * reminted onto instance and setup-slot keys.
 */
export function readGundamPresentation(resources: unknown): GundamPresentation | undefined {
  if (!isRecord(resources)) return undefined;
  const fromMaps = presentationFrom(resources.cardsMaps);
  if (fromMaps) return fromMaps;
  const direct = presentationFrom(resources);
  if (direct) return direct;
  if (isRecord(resources.players)) {
    for (const entry of Object.values(resources.players)) {
      const fromPlayer = readGundamPresentation(entry);
      if (fromPlayer) return fromPlayer;
    }
  }
  return readGundamPresentation(resources.spectator) ?? readGundamPresentation(resources.replay);
}

export function resolveGundamPresentationPrintingId(
  presentation: GundamPresentation,
  instanceId: string,
  ownerId?: string,
): string | undefined {
  const byInstance = presentation.printingIdByInstanceId[instanceId];
  if (byInstance) return byInstance;
  const setup = parseSetupTokenInstance(instanceId);
  if (!setup) return undefined;
  return presentation.printingIdBySetupSlotByOwnerId?.[ownerId ?? setup.ownerId]?.[setup.slot];
}

export function cardWithPresentationPrinting(def: Card, printingId: string): Card {
  if (def.selectedPrintingId === printingId) return def;
  const existing = def.printings?.find((printing) => printing.id === printingId);
  if (existing) {
    return { ...def, selectedPrintingId: printingId };
  }

  const info = getGundamPrintingInfo(printingId);
  const extraPrinting = {
    id: printingId,
    artId: info?.artId ?? printingId,
    setCode: info?.setCode ?? "",
    set: info?.set ?? { code: info?.setCode ?? "", name: info?.setCode ?? "" },
    collectorNumber: info?.collectorNumber ?? printingId,
    cardNumber: def.cardNumber,
    rarity: info?.rarity ?? def.rarity,
    finish: info?.finish ?? "standard",
    imageUrl: info?.imageUrl ?? "",
  };
  return {
    ...def,
    selectedPrintingId: printingId,
    printings: [...(def.printings ?? []), extraPrinting],
    ...(info?.imageUrl ? { imageUrl: info.imageUrl } : {}),
  };
}

/** Stamp per-instance printings onto a viewer projection without mutating shared catalog defs. */
export function applyGundamPresentationToView<G extends object>(
  view: FilteredMatchView<G>,
  presentation: GundamPresentation | undefined,
): FilteredMatchView<G> {
  if (!hasPresentationEntries(presentation)) return view;

  let changed = false;
  const nextZones: FilteredMatchView<G>["zones"]["zones"] = {};
  for (const [zoneKey, zone] of Object.entries(view.zones.zones)) {
    const cards = zone.cards.map((card) => {
      if (!card.definition || card.faceDown) return card;
      const printingId = resolveGundamPresentationPrintingId(
        presentation,
        card.instanceId,
        card.ownerId,
      );
      if (!printingId) return card;
      const definition = cardWithPresentationPrinting(card.definition, printingId);
      if (definition === card.definition) return card;
      changed = true;
      return { ...card, definition };
    });
    nextZones[zoneKey] = cards === zone.cards ? zone : { ...zone, cards };
  }
  if (!changed) return view;
  return { ...view, zones: { ...view.zones, zones: nextZones } };
}

/**
 * Filter authoritative cards maps down to what one viewer's filtered view
 * already reveals. The authoritative maps index every instance of the match —
 * including the opponent's face-down deck — so shipping them wholesale to a
 * viewer would leak hidden deck composition through `owners`,
 * `cardInstances`, and the presentation overlay.
 *
 * Visibility uses the same reveal predicate as
 * {@link applyGundamPresentationToView}: the engine's filtered view emits
 * every zone and keeps hidden cards in it with their `instanceId` (definition
 * cleared, faceDown set), so zone membership alone is NOT visibility. Only
 * cards carrying a definition the viewer may see expose their map entries.
 * Setup-slot entries survive only while their token instance is visible:
 * setup tokens live in public zones once placed, and the overlay must not
 * pre-announce them.
 */
export function filterGundamCardsMapsForView<G extends object>(
  cardsMaps: CardsMaps,
  view: FilteredMatchView<G>,
): CardsMaps {
  const visibleInstanceIds = new Set<string>();
  for (const zone of Object.values(view.zones.zones)) {
    for (const card of zone.cards) {
      if (card.faceDown || !card.definition) continue;
      visibleInstanceIds.add(card.instanceId);
    }
  }
  if (visibleInstanceIds.size === 0) return { cardInstances: {}, owners: {} };

  const cardInstances = filterRecordToKeys(cardsMaps.cardInstances, visibleInstanceIds);
  const owners: Record<string, string[]> = {};
  for (const [ownerId, instanceIds] of Object.entries(cardsMaps.owners)) {
    const owned = instanceIds.filter((instanceId) => visibleInstanceIds.has(instanceId));
    if (owned.length > 0) owners[ownerId] = owned;
  }
  const instanceSections = cardsMaps.instanceSections
    ? filterRecordToKeys(cardsMaps.instanceSections, visibleInstanceIds)
    : undefined;
  const presentation = cardsMaps.presentation
    ? {
        printingIdByInstanceId: filterRecordToKeys(
          cardsMaps.presentation.printingIdByInstanceId,
          visibleInstanceIds,
        ),
        ...(cardsMaps.presentation.printingIdBySetupSlotByOwnerId
          ? {
              printingIdBySetupSlotByOwnerId: filterSetupSlotsToVisible(
                cardsMaps.presentation.printingIdBySetupSlotByOwnerId,
                visibleInstanceIds,
              ),
            }
          : {}),
      }
    : undefined;

  return {
    cardInstances,
    owners,
    ...(instanceSections ? { instanceSections } : {}),
    ...(presentation ? { presentation } : {}),
  };
}

function filterRecordToKeys(
  record: Record<string, string>,
  keys: ReadonlySet<string>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(record)) {
    if (keys.has(key)) out[key] = value;
  }
  return out;
}

function filterSetupSlotsToVisible(
  slotsByOwner: Record<string, Record<string, string>>,
  visibleInstanceIds: ReadonlySet<string>,
): Record<string, Record<string, string>> {
  const out: Record<string, Record<string, string>> = {};
  for (const [ownerId, slots] of Object.entries(slotsByOwner)) {
    const kept: Record<string, string> = {};
    for (const [slot, printingId] of Object.entries(slots)) {
      const prefix = SETUP_TOKEN_INSTANCE_PREFIX[slot as keyof typeof SETUP_TOKEN_INSTANCE_PREFIX];
      if (prefix && visibleInstanceIds.has(`${prefix}${ownerId}`)) kept[slot] = printingId;
    }
    if (Object.keys(kept).length > 0) out[ownerId] = kept;
  }
  return out;
}

function hasPresentationEntries(
  presentation: GundamPresentation | undefined,
): presentation is GundamPresentation {
  if (!presentation) return false;
  if (Object.keys(presentation.printingIdByInstanceId).length > 0) return true;
  const slots = presentation.printingIdBySetupSlotByOwnerId;
  if (!slots) return false;
  return Object.values(slots).some((ownerSlots) => Object.keys(ownerSlots).length > 0);
}

function presentationFrom(value: unknown): GundamPresentation | undefined {
  if (!isRecord(value) || !isRecord(value.presentation)) return undefined;
  const printingIdByInstanceId = stringRecord(value.presentation.printingIdByInstanceId);
  if (!printingIdByInstanceId) return undefined;
  const setup = value.presentation.printingIdBySetupSlotByOwnerId;
  const printingIdBySetupSlotByOwnerId = isRecord(setup)
    ? Object.fromEntries(
        Object.entries(setup).flatMap(([ownerId, slots]) => {
          const parsed = stringRecord(slots);
          return parsed ? [[ownerId, parsed] as const] : [];
        }),
      )
    : undefined;
  return {
    printingIdByInstanceId,
    ...(printingIdBySetupSlotByOwnerId && Object.keys(printingIdBySetupSlotByOwnerId).length > 0
      ? { printingIdBySetupSlotByOwnerId }
      : {}),
  };
}

function parseSetupTokenInstance(
  instanceId: string,
): { ownerId: string; slot: keyof typeof SETUP_TOKEN_INSTANCE_PREFIX } | undefined {
  for (const [slot, prefix] of Object.entries(SETUP_TOKEN_INSTANCE_PREFIX) as Array<
    [keyof typeof SETUP_TOKEN_INSTANCE_PREFIX, string]
  >) {
    if (instanceId.startsWith(prefix)) {
      return { ownerId: instanceId.slice(prefix.length), slot };
    }
  }
  return undefined;
}

function stringRecord(value: unknown): Record<string, string> | undefined {
  if (!isRecord(value)) return undefined;
  const out: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === "string" && entry.length > 0) out[key] = entry;
  }
  return out;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
