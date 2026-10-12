import { dealStagger, flightDuration } from "@tcg/simulator-presentation/opening";
import { resolveCardTransferPose } from "@tcg/simulator-presentation/motion";
import type { GrandArchiveBoardCard, GrandArchiveBoardProjection } from "./types";
import type { GrandArchivePose } from "./layout";
import type { GrandArchivePresentationSnapshot } from "./animation";

export interface GrandArchiveOpeningFlight {
  readonly key: string;
  readonly origin: GrandArchivePose;
  readonly delay: number;
  readonly duration: number;
  readonly reveal: boolean;
  readonly showcase: boolean;
}

/** New authorized cards start at a public pile position, never at a hidden object's identity. */
export function grandArchiveOpeningFlights(
  previous: GrandArchivePresentationSnapshot | undefined,
  current: GrandArchiveBoardProjection,
): ReadonlyMap<string, GrandArchiveOpeningFlight> {
  const flights = new Map<string, GrandArchiveOpeningFlight>();
  if (!previous || previous.projection.resetKey !== current.resetKey) return flights;
  const before = previous.projection.opening;
  const after = current.opening;
  if (!before || !after || after.stateVersion <= before.stateVersion || after.turn > 1)
    return flights;
  if (!before.pregame && !previous.openingObserved) return flights;
  const oldCards = previous.projection.cards;
  const pile = (owner: GrandArchiveBoardCard["owner"], zone: "main-deck" | "material-deck") => {
    const cards = oldCards.filter((card) => card.owner === owner && card.zone === zone);
    return cards
      .map((card) => previous.poses.get(card.id))
      .filter((pose): pose is GrandArchivePose => !!pose)
      .sort((a, b) => b.y - a.y)[0];
  };
  for (const owner of ["self", "opponent"] as const) {
    const champion = current.cards.find(
      (card) =>
        card.owner === owner &&
        card.zone === "field" &&
        card.role === "champion" &&
        !card.attachedTo,
    );
    const revealing =
      champion &&
      !oldCards.some(
        (card) => card.owner === owner && card.zone === "field" && card.role === "champion",
      );
    const materialOrigin = pile(owner, "material-deck");
    if (revealing && materialOrigin && !champion.faceDown) {
      flights.set(champion.id, {
        key: `opening:${after.stateVersion}:${champion.id}`,
        origin: materialOrigin,
        delay: 0,
        duration: 1250,
        reveal: true,
        showcase: true,
      });
    }
    const oldHand = oldCards.filter((card) => card.owner === owner && card.zone === "hand");
    const newHand = current.cards.filter((card) => card.owner === owner && card.zone === "hand");
    const deckOrigin = pile(owner, "main-deck");
    // An empty hand alone is not sufficient: the opening was observed and this seat has not dealt yet.
    if (!deckOrigin || oldHand.length || !newHand.length || previous.openingDealt?.includes(owner))
      continue;
    newHand.forEach((card, index) =>
      flights.set(card.id, {
        key: `opening:${after.stateVersion}:${card.id}`,
        origin: deckOrigin,
        delay: (revealing ? 1300 : 0) + index * dealStagger,
        duration: flightDuration,
        reveal: !card.faceDown,
        showcase: false,
      }),
    );
  }
  return flights;
}

/** Same flight sampler and timing as the shared opening sequence, mapped into GA world space. */
export function sampleGrandArchiveOpeningFlight(
  flight: GrandArchiveOpeningFlight,
  target: GrandArchivePose,
  elapsed: number,
) {
  const rect = (pose: GrandArchivePose) => ({
    left: pose.x - pose.scale / 2,
    top: pose.z - pose.scale * 0.7,
    width: pose.scale,
    height: pose.scale * 1.4,
  });
  const via = flight.showcase
    ? { ...target, x: target.x * 0.55, z: target.z * 0.42, scale: Math.max(target.scale, 2.5) }
    : undefined;
  const pose = resolveCardTransferPose({
    source: rect(flight.origin),
    destination: rect(target),
    ...(via ? { via: rect(via), viaHold: 0.25 } : {}),
    elapsedMs: elapsed,
    startAtMs: flight.delay,
    durationMs: flight.duration,
    sourceVisible: true,
    destinationVisible: true,
    holdsAtSource: true,
    faceChanges: flight.reveal,
    choreography: { liftPx: 0, revealStart: 0.12, revealDuration: 0.35 },
  });
  const revealProgress = Math.min(1, Math.max(0, (pose.progress - 0.12) / 0.35));
  return {
    x: pose.centerX,
    z: pose.centerY,
    y: flight.origin.y + (target.y - flight.origin.y) * pose.progress + pose.depth / 80,
    scale: pose.width,
    turn: flight.origin.turn + (target.turn - flight.origin.turn) * pose.progress,
    flip: flight.reveal ? Math.PI * (1 - revealProgress) : 0,
    done: elapsed >= flight.delay + flight.duration,
  };
}
