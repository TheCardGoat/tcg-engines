import type { SimulatorDeckReveal, SimulatorDeckRevealCard } from "@tcg/simulator-contract";

/**
 * Presentation-only recall of a public reveal. It deliberately records no
 * game state: callers must revalidate the exact card against the deck edge
 * after every engine command and discard it at the next turn boundary.
 */
export interface FabDeckRevealRecall {
  readonly id: string;
  readonly ownerId: string;
  readonly instanceId: string;
  readonly position: SimulatorDeckReveal["position"];
  readonly turnNumber: number;
  readonly definitionId?: string;
  readonly title?: string;
  readonly subtitle?: string;
  readonly imageUrl?: string;
}

export interface FabHandRevealRecall {
  readonly id: string;
  readonly ownerId: string;
  readonly instanceId: string;
  readonly turnNumber: number;
  readonly definitionId?: string;
  readonly title?: string;
  readonly subtitle?: string;
  readonly imageUrl?: string;
}

export type FabRevealCardPresentation = Pick<
  SimulatorDeckRevealCard,
  "definitionId" | "title" | "subtitle" | "imageUrl"
>;

export function nextFabDeckRevealRecalls(input: {
  readonly current: Readonly<Record<string, FabDeckRevealRecall | undefined>>;
  readonly decks: Readonly<Record<string, readonly string[] | undefined>>;
  readonly turnNumber: number;
  readonly presentationByInstanceId?: Readonly<
    Record<string, FabRevealCardPresentation | undefined>
  >;
  readonly events: readonly {
    readonly name: string;
    readonly eventId: string;
    readonly turnNumber: number;
    readonly data: unknown;
  }[];
}): Readonly<Record<string, FabDeckRevealRecall | undefined>> {
  const next: Record<string, FabDeckRevealRecall | undefined> = {};
  for (const [ownerId, reveal] of Object.entries(input.current)) {
    if (!reveal || reveal.turnNumber !== input.turnNumber) continue;
    if (isAtRecordedDeckEdge(input.decks[ownerId] ?? [], reveal)) next[ownerId] = reveal;
  }

  for (const event of input.events) {
    if (event.name !== "reveal") continue;
    const reveal = revealDeckObject(event.data);
    if (!reveal || event.turnNumber !== input.turnNumber) {
      continue;
    }
    const deck = input.decks[reveal.ownerId] ?? [];
    const position =
      deck.at(-1) === reveal.instanceId ? "top" : deck[0] === reveal.instanceId ? "bottom" : null;
    if (!position) continue;
    next[reveal.ownerId] = {
      id: `fab-deck-reveal:${event.eventId}`,
      ownerId: reveal.ownerId,
      instanceId: reveal.instanceId,
      position,
      turnNumber: input.turnNumber,
      ...input.presentationByInstanceId?.[reveal.instanceId],
      ...(reveal.title ? { title: reveal.title } : {}),
    };
  }
  return next;
}

function revealDeckObject(
  data: unknown,
): { readonly ownerId: string; readonly instanceId: string; readonly title?: string } | null {
  return revealObjectInZone(data, "deck");
}

function revealObjectInZone(
  data: unknown,
  zone: "deck" | "hand",
): { readonly ownerId: string; readonly instanceId: string; readonly title?: string } | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  const playerId = record.playerId;
  const object = record.object;
  if (typeof playerId !== "string" || !object || typeof object !== "object") return null;
  const snapshot = object as Record<string, unknown>;
  if (snapshot.zone !== zone || typeof snapshot.instanceId !== "string") return null;
  const current = snapshot.current;
  const currentRecord =
    current && typeof current === "object" ? (current as Record<string, unknown>) : null;
  return {
    ownerId: playerId,
    instanceId: snapshot.instanceId,
    ...(typeof currentRecord?.name === "string" ? { title: currentRecord.name } : {}),
  };
}

export function projectFabDeckReveal(
  recall: FabDeckRevealRecall | undefined,
): SimulatorDeckReveal | undefined {
  if (!recall) return undefined;
  return {
    id: recall.id,
    zoneId: `${recall.ownerId}:deck`,
    ownerId: recall.ownerId,
    position: recall.position,
    visibility: "public",
    turnNumber: recall.turnNumber,
    count: 1,
    cards: [
      {
        entityId: recall.instanceId,
        ...(recall.definitionId ? { definitionId: recall.definitionId } : {}),
        title: recall.title,
        subtitle: recall.subtitle,
        imageUrl: recall.imageUrl,
      },
    ],
  };
}

export function nextFabHandRevealRecalls(input: {
  readonly current: Readonly<Record<string, readonly FabHandRevealRecall[] | undefined>>;
  readonly hands: Readonly<Record<string, readonly string[] | undefined>>;
  readonly turnNumber: number;
  readonly presentationByInstanceId?: Readonly<
    Record<string, FabRevealCardPresentation | undefined>
  >;
  readonly events: readonly {
    readonly name: string;
    readonly eventId: string;
    readonly turnNumber: number;
    readonly data: unknown;
  }[];
}): Readonly<Record<string, readonly FabHandRevealRecall[] | undefined>> {
  const next: Record<string, FabHandRevealRecall[]> = {};
  for (const [ownerId, reveals] of Object.entries(input.current)) {
    const hand = input.hands[ownerId] ?? [];
    const retained = (reveals ?? []).filter(
      (reveal) => reveal.turnNumber === input.turnNumber && hand.includes(reveal.instanceId),
    );
    if (retained.length > 0) next[ownerId] = retained;
  }

  for (const event of input.events) {
    if (event.name !== "reveal" || event.turnNumber !== input.turnNumber) continue;
    const reveal = revealObjectInZone(event.data, "hand");
    if (!reveal || !(input.hands[reveal.ownerId] ?? []).includes(reveal.instanceId)) continue;
    const existing = next[reveal.ownerId] ?? [];
    if (existing.some((candidate) => candidate.instanceId === reveal.instanceId)) continue;
    next[reveal.ownerId] = [
      ...existing,
      {
        id: `fab-hand-reveal:${event.eventId}`,
        ownerId: reveal.ownerId,
        instanceId: reveal.instanceId,
        turnNumber: input.turnNumber,
        ...input.presentationByInstanceId?.[reveal.instanceId],
        ...(reveal.title ? { title: reveal.title } : {}),
      },
    ];
  }
  return next;
}

export function projectFabHandRevealCards(
  recalls: readonly FabHandRevealRecall[] | undefined,
): readonly SimulatorDeckRevealCard[] {
  return (recalls ?? []).map((recall) => ({
    entityId: recall.instanceId,
    ...(recall.definitionId ? { definitionId: recall.definitionId } : {}),
    title: recall.title,
    subtitle: recall.subtitle,
    imageUrl: recall.imageUrl,
  }));
}

function isAtRecordedDeckEdge(deck: readonly string[], reveal: FabDeckRevealRecall): boolean {
  return reveal.position === "top"
    ? deck.at(-1) === reveal.instanceId
    : deck[0] === reveal.instanceId;
}
