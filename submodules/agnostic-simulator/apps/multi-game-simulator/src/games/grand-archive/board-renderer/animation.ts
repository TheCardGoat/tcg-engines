import type { GrandArchivePose } from "./layout";
import type { GrandArchiveBoardProjection } from "./types";

export interface GrandArchivePresentationSnapshot {
  readonly projection: GrandArchiveBoardProjection;
  readonly poses: ReadonlyMap<string, GrandArchivePose>;
}

/**
 * A new incarnation is a new mesh, but a continuously visible physical card can
 * travel from its previous public position. Never connect anonymous concealed
 * slots, newly revealed cards, or snapshots across a reconnect/seek boundary.
 */
export function grandArchiveAnimationOrigins(
  previous: GrandArchivePresentationSnapshot | undefined,
  current: GrandArchiveBoardProjection,
): ReadonlyMap<string, GrandArchivePose> {
  const origins = new Map<string, GrandArchivePose>();
  if (!previous || previous.projection.resetKey !== current.resetKey) return origins;
  const oldCards = new Map(previous.projection.cards.map((card) => [card.id, card]));
  for (const card of current.cards) {
    const prior = oldCards.get(card.id);
    if (!prior || prior.faceDown || card.faceDown || prior.incarnation === card.incarnation)
      continue;
    const pose = previous.poses.get(card.id);
    if (pose) origins.set(card.id, pose);
  }
  return origins;
}
