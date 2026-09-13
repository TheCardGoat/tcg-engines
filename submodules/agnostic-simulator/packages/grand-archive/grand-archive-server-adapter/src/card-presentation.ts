import { STANDARD_CARD_IMAGE_ASPECT_RATIO, type SimulatorEntity } from "@tcg/simulator-contract";

const GRAND_ARCHIVE_CARD_BACK_URL =
  "https://cdn.tcg.online/public/grand-archive/simulator/card-back.webp";

/** Keep the portrait back and its footprint together for every Grand Archive surface. */
export function grandArchiveCardPresentation(entity: SimulatorEntity): SimulatorEntity {
  return {
    ...entity,
    backImageUrl: GRAND_ARCHIVE_CARD_BACK_URL,
    hiddenBackLayout: undefined,
    imageAspectRatio:
      entity.face === "hidden"
        ? STANDARD_CARD_IMAGE_ASPECT_RATIO
        : (entity.imageAspectRatio ?? STANDARD_CARD_IMAGE_ASPECT_RATIO),
  };
}

/** Count-only zones have no card identity to project. */
export function grandArchiveConcealedCard(id: string, ownerId: string): SimulatorEntity {
  return grandArchiveCardPresentation({
    id,
    title: "Hidden card",
    subtitle: "Private information",
    kind: "card",
    ownerId,
    face: "hidden",
    states: [],
    stats: [],
    traits: [],
  });
}
