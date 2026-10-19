import type {
  GrandArchiveBoardCard,
  GrandArchiveBoardZone,
  GrandArchiveCardScreenPosition,
} from "./types";

export interface GrandArchivePose {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly turn: number;
  readonly scale: number;
}

/** One landscape composition at every viewport; only the camera fit changes. */
export const GRAND_ARCHIVE_ARENA = Object.freeze({ width: 22, height: 10 });
export const GRAND_ARCHIVE_CARD_ASPECT = 2.5 / 3.5;
export const GRAND_ARCHIVE_FIELD_CAPACITY = 5;

/** Extra field cards remain in the accessible Cards & actions browser. */
export function grandArchiveFieldOverflow(
  cards: readonly GrandArchiveBoardCard[],
): Readonly<Record<GrandArchiveBoardCard["owner"], number>> {
  const counts = { self: 0, opponent: 0 };
  for (const card of cards) {
    if (card.zone === "field" && card.role !== "champion" && card.attachedTo === undefined)
      counts[card.owner]++;
  }
  return {
    self: Math.max(0, counts.self - GRAND_ARCHIVE_FIELD_CAPACITY),
    opponent: Math.max(0, counts.opponent - GRAND_ARCHIVE_FIELD_CAPACITY),
  };
}

export function grandArchiveLayout(
  cards: readonly GrandArchiveBoardCard[],
): ReadonlyMap<string, GrandArchivePose> {
  const poses = new Map<string, GrandArchivePose>();
  const roots = cards.filter((card) => card.attachedTo === undefined);
  for (const card of roots) {
    const zone = roots.filter(
      (other) =>
        (card.zone === "effects-stack" || other.owner === card.owner) &&
        other.zone === card.zone &&
        other.role === card.role,
    );
    const index = zone.findIndex((other) => other.id === card.id);
    const sign = card.owner === "self" ? 1 : -1;
    let x = 0;
    let z = 0;
    let y = 0.08;
    let turn = 0;
    let scale = 1;
    switch (card.zone) {
      case "field": {
        if (card.role === "champion") {
          x = -8 * sign + (index - (zone.length - 1) / 2) * 0.4;
          z = 2.35;
          scale = 1.9;
          break;
        }
        if (index >= GRAND_ARCHIVE_FIELD_CAPACITY) continue;
        const visibleCount = Math.min(zone.length, GRAND_ARCHIVE_FIELD_CAPACITY);
        // Keep a central decision strip between both field rows. Crowded
        // fields remain in one row; Cards & actions exposes overflow.
        x = (index - (visibleCount - 1) / 2) * 2.05 - 1.2 * sign;
        z = 2.35;
        scale = 1.8;
        y += index * 0.003;
        break;
      }
      case "hand": {
        const offset = index - (zone.length - 1) / 2;
        x = offset * Math.min(1.2, 8 / Math.max(1, zone.length - 1)) - 1.2 * sign;
        z = 4.65;
        y = 0.12 + index * 0.005;
        turn = -x * 0.027;
        scale = 1.3;
        break;
      }
      case "memory":
        x =
          (4.45 +
            (index - (zone.length - 1) / 2) * Math.min(0.32, 1.8 / Math.max(1, zone.length - 1))) *
          sign;
        z = 4.3;
        y = 0.16 + index * 0.003;
        scale = 0.42;
        break;
      case "material-deck":
        x = -9.8 * sign;
        z = 4.55;
        scale = 0.88;
        y += index * 0.022;
        break;
      case "main-deck": {
        const backs = zone.filter((entry) => entry.faceDown);
        const faces = zone.filter((entry) => !entry.faceDown);
        const backIndex = backs.findIndex((entry) => entry.id === card.id);
        if (card.faceDown && backIndex < backs.length - 3) continue;
        const pileIndex = card.faceDown
          ? backIndex - Math.max(0, backs.length - 3)
          : Math.min(3, backs.length) + faces.findIndex((entry) => entry.id === card.id);
        x = 8.75 * sign + pileIndex * 0.035;
        z = 2.55;
        scale = 1.35;
        y = 0.18 + pileIndex * 0.025;
        break;
      }
      case "graveyard":
        x = -8.55 * sign;
        z = 4.55;
        scale = 0.88;
        y += index * 0.018;
        break;
      case "banished":
        x = -7.3 * sign;
        z = 4.55;
        scale = 0.88;
        y += index * 0.018;
        break;
      case "effects-stack":
        x = -9.8 * sign;
        z = 0;
        scale = 0.64;
        y += index * 0.025;
        break;
      case "intent":
        x = 5.25 * sign;
        z = 2.35;
        scale = 0.64;
        y += index * 0.025;
        break;
    }
    if (card.rested) turn -= Math.PI / 2;
    poses.set(card.id, { x: x * sign, y, z: z * sign, turn, scale });
  }
  // Resolve nested lineage/loaded attachments without inventing absent hosts.
  let remaining = cards.filter((card) => card.attachedTo !== undefined);
  for (let pass = 0; remaining.length > 0 && pass < cards.length; pass++) {
    const unresolved: GrandArchiveBoardCard[] = [];
    for (const card of remaining) {
      const parent = card.attachedTo ? poses.get(card.attachedTo) : undefined;
      if (!parent) {
        unresolved.push(card);
        continue;
      }
      poses.set(card.id, {
        x: parent.x + 0.32 * parent.scale,
        y: parent.y - 0.015,
        z: parent.z + 0.22 * parent.scale,
        turn: parent.turn,
        scale: parent.scale,
      });
    }
    if (unresolved.length === remaining.length) break;
    remaining = unresolved;
  }
  return poses;
}

export function grandArchiveScreenPosition(
  pose: GrandArchivePose,
  viewportAspect = GRAND_ARCHIVE_ARENA.width / GRAND_ARCHIVE_ARENA.height,
  cardAspect = GRAND_ARCHIVE_CARD_ASPECT,
): GrandArchiveCardScreenPosition {
  const height = Math.max(GRAND_ARCHIVE_ARENA.height, GRAND_ARCHIVE_ARENA.width / viewportAspect);
  const width = height * viewportAspect;
  const cardWidth = pose.scale;
  const cardHeight = pose.scale / cardAspect;
  const cosine = Math.abs(Math.cos(pose.turn));
  const sine = Math.abs(Math.sin(pose.turn));
  return {
    left: (0.5 + pose.x / width) * 100,
    top: (0.5 + pose.z / height) * 100,
    width: ((cardWidth * cosine + cardHeight * sine) / width) * 100,
    height: ((cardHeight * cosine + cardWidth * sine) / height) * 100,
  };
}

/** Hidden faces cannot trigger a face texture request, even from a malformed caller. */
export function grandArchiveCardTextureUrl(
  card: GrandArchiveBoardCard,
  cardBackUrl: string,
): string {
  return !card.faceDown && card.faceUrl ? card.faceUrl : cardBackUrl;
}

export function zoneLabel(zone: GrandArchiveBoardZone): string {
  return (
    {
      field: "Field",
      hand: "Hand",
      memory: "Memory",
      "material-deck": "Material Deck",
      "main-deck": "Main Deck",
      graveyard: "Graveyard",
      banished: "Banishment",
      "effects-stack": "Effects Stack",
      intent: "Intent",
    } satisfies Record<GrandArchiveBoardZone, string>
  )[zone];
}
