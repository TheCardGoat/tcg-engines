import type {
  LorcanaCardSnapshot,
  LorcanaTableSeat,
} from "@/features/simulator/model/contracts.js";

export interface OrderedPlayZoneCardEntry {
  kind: "card";
  card: LorcanaCardSnapshot;
}

export interface OrderedPlayZoneLocationClusterEntry {
  kind: "locationCluster";
  location: LorcanaCardSnapshot;
  occupants: LorcanaCardSnapshot[];
}

export type OrderedPlayZoneEntry = OrderedPlayZoneCardEntry | OrderedPlayZoneLocationClusterEntry;

function flattenPlayZoneEntry(entry: OrderedPlayZoneEntry): LorcanaCardSnapshot[] {
  if (entry.kind === "card") {
    return [entry.card];
  }

  return [entry.location, ...entry.occupants];
}

export function buildOrderedPlayZoneEntries(
  cards: readonly LorcanaCardSnapshot[],
  seat: LorcanaTableSeat,
): OrderedPlayZoneEntry[] {
  const locationIds = new Set(
    cards.filter((card) => card.cardType === "location").map((card) => card.cardId),
  );
  const occupantsByLocation = new Map<string, LorcanaCardSnapshot[]>();
  const orderedEntries: OrderedPlayZoneEntry[] = [];
  const standaloneEntries: OrderedPlayZoneEntry[] = [];
  const locationClusterEntries: OrderedPlayZoneEntry[] = [];

  for (const card of cards) {
    if (
      card.cardType !== "character" ||
      !card.atLocationId ||
      !locationIds.has(card.atLocationId)
    ) {
      continue;
    }

    const occupants = occupantsByLocation.get(card.atLocationId) ?? [];
    occupants.push(card);
    occupantsByLocation.set(card.atLocationId, occupants);
  }

  for (const card of cards) {
    if (card.cardType === "location") {
      const occupants = occupantsByLocation.get(card.cardId) ?? [];
      const clusterEntry: OrderedPlayZoneEntry = {
        kind: "locationCluster",
        location: card,
        occupants,
      };

      if (seat === "bottom") {
        locationClusterEntries.push(clusterEntry);
      } else {
        orderedEntries.push(clusterEntry);
      }
      continue;
    }

    if (card.cardType === "character" && card.atLocationId && locationIds.has(card.atLocationId)) {
      continue;
    }

    const nextEntry: OrderedPlayZoneEntry = { kind: "card", card };
    if (seat === "bottom") {
      standaloneEntries.push(nextEntry);
    } else {
      orderedEntries.push(nextEntry);
    }
  }

  if (seat !== "bottom") {
    return orderedEntries;
  }

  return [...standaloneEntries, ...locationClusterEntries];
}

export function getOrderedPlayZoneCards(
  cards: readonly LorcanaCardSnapshot[],
  seat: LorcanaTableSeat,
): LorcanaCardSnapshot[] {
  return buildOrderedPlayZoneEntries(cards, seat).flatMap(flattenPlayZoneEntry);
}
