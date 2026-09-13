import type {
  AnimationPlanV2,
  AnimationRef,
  AnimationStepV2,
  AnimationZoneRef,
  EntityTransferStepV2,
} from "@tcg/protocol/animations";
import type { FabPresentationCard, FabPresentationState } from "./state";

export const FAB_TRANSFER_DURATION_MS = 440;
const STAGGER_MS = 45;

type TransferCard = FabPresentationCard;

type Board = Pick<FabPresentationState, "cards">;

/** Transfers describe two visible boards, never the engine events between them. */
export function fabBoardTransfers(
  from: Board,
  to: Board,
  transitionId: string,
  viewerId: string | null,
  locationHints: AnimationPlanV2 | null = null,
): AnimationPlanV2 | null {
  const steps: EntityTransferStepV2[] = [];
  const semanticSteps: AnimationStepV2[] =
    locationHints?.steps.filter((step) => step.type === "phaseChange").slice(-1) ?? [];
  const departures: FabPresentationCard[] = [];
  const arrivals: FabPresentationCard[] = [];
  const physical = (card: FabPresentationCard) =>
    !card.sourceInstanceId && !card.id.startsWith("rules-stack:");

  const add = (source: TransferCard, destination: TransferCard) => {
    if (
      source.zone === destination.zone &&
      source.ownerId === destination.ownerId &&
      source.equipmentSlot === destination.equipmentSlot
    )
      return;
    steps.push({
      id: `${transitionId}:transfer:${steps.length}`,
      type: "entityTransfer",
      entity: {
        kind: "entity",
        id: anonymous(destination) && !anonymous(source) ? source.id : destination.id,
      },
      from: endpoint(source, source.id !== destination.id),
      to: endpoint(destination, source.id !== destination.id),
      sourceFace: face(source, viewerId),
      destinationFace: face(destination, viewerId),
      durationMs: FAB_TRANSFER_DURATION_MS,
      // Resolution and chain cleanup are a single visual exchange. The
      // resolving layer and every affected chain card leave together, while
      // unrelated multi-card moves retain a small readability stagger.
      startAtMs:
        source.zone === "stack" || source.zone === "combat-chain"
          ? 0
          : Math.min(steps.length * STAGGER_MS, 180),
      audioCue: destination.zone === "hand" && source.zone === "deck" ? "card.draw" : "card.move",
    });
  };

  for (const card of Object.values(from.cards).filter(physical)) {
    const next = to.cards[card.id];
    if (next && physical(next)) add(card, next);
    else departures.push(card);
  }
  for (const card of Object.values(to.cards).filter(physical)) {
    if (!from.cards[card.id]) arrivals.push(card);
  }

  // Full-state location deltas disambiguate net private-zone counts (for
  // example returning pitch and drawing in the same update). They contain no
  // event interpretation; actual rendered locations still win for known cards.
  for (const hint of locationHints?.steps ?? []) {
    if (hint.type !== "entityTransfer" || hint.from?.kind !== "zone" || hint.to?.kind !== "zone")
      continue;
    if (from.cards[hint.entity.id] && to.cards[hint.entity.id]) continue;
    const take = (cards: FabPresentationCard[], ref: AnimationZoneRef) => {
      const exactIndex = cards.findIndex((card) => card.id === hint.entity.id);
      const index =
        exactIndex >= 0
          ? exactIndex
          : cards.findIndex((card) => anonymous(card) && endpoint(card, false).id === ref.id);
      return index < 0 ? undefined : cards.splice(index, 1)[0];
    };
    const source = take(departures, hint.from);
    const destination = take(arrivals, hint.to);
    const virtual = (ref: AnimationZoneRef, suffix: string): TransferCard | null => {
      const zone = ref.id.slice(ref.id.lastIndexOf(":") + 1);
      if (
        zone !== "deck" &&
        zone !== "hand" &&
        zone !== "arsenal" &&
        zone !== "banished" &&
        zone !== "soul"
      )
        return null;
      const ownerId = ref.ownerId ?? source?.ownerId ?? destination?.ownerId;
      return ownerId
        ? {
            id: `fab-hidden:${encodeURIComponent(ownerId)}:${hint.id}:${suffix}`,
            cardId: "face-down",
            ownerId,
            zone,
            face: "down",
          }
        : null;
    };
    const resolvedSource = source ?? virtual(hint.from, "source");
    const resolvedDestination = destination ?? virtual(hint.to, "destination");
    if (resolvedSource && resolvedDestination) add(resolvedSource, resolvedDestination);
  }

  // A viewer's anonymous slots have zone-local identities. Match only a single
  // source/destination zone with equal counts; never invent hidden card identity
  // or pair two unrelated public cards. Ambiguous changes simply render settled.
  for (const ownerId of new Set([...departures, ...arrivals].map((card) => card.ownerId))) {
    const removed = departures.filter((card) => card.ownerId === ownerId);
    const added = arrivals.filter((card) => card.ownerId === ownerId);
    if (!removed.length || removed.length !== added.length) continue;
    if (
      new Set(removed.map((card) => card.zone)).size !== 1 ||
      new Set(added.map((card) => card.zone)).size !== 1
    )
      continue;
    if (!removed.every(anonymous) && !added.every(anonymous)) continue;
    removed.forEach((card, index) => add(card, added[index]!));
  }

  return steps.length || semanticSteps.length
    ? {
        id: `${transitionId}:transfers`,
        version: 2,
        steps: [...steps, ...semanticSteps],
      }
    : null;
}

function anonymous(card: TransferCard): boolean {
  return card.cardId === "face-down";
}

function face(card: TransferCard, viewerId: string | null): "public" | "hidden" {
  if (anonymous(card) || card.zone === "deck") return "hidden";
  if (card.zone === "hand" || card.zone === "arsenal")
    return card.ownerId === viewerId ? "public" : "hidden";
  return card.face === "up" ? "public" : "hidden";
}

function endpoint(card: TransferCard, differentIdentity: boolean): AnimationRef {
  // Piles have aggregate anchors. Visible slots can bind the anonymous source
  // and destination independently without exposing a physical card identifier.
  // A pending attack is already displayed in the combat workspace while its
  // physical zone is still stack. Bind its actual card node, not the separate
  // generic stack anchor, so the destination is hidden during the flight.
  if (
    (differentIdentity || card.zone === "stack") &&
    !card.id.startsWith("fab-hidden:") &&
    (card.zone === "hand" || card.zone === "combat-chain" || card.zone === "stack")
  ) {
    return { kind: "entity", id: card.id };
  }
  return {
    kind: "zone",
    id: `${card.ownerId}:${card.zone === "weapon" ? (card.equipmentSlot ?? "weapon1") : card.zone}`,
    ownerId: card.ownerId,
  };
}
