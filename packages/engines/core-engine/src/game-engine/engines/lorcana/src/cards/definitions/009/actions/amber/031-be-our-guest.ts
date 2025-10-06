import { beOurGuest as ogBeOurGuest } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/025-be-our-guest";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const beOurGuest: LorcanaActionCardDefinition = {
  ...ogBeOurGuest,
  id: "cwb",
  reprints: [ogBeOurGuest.id],
  number: 31,
  set: "009",
};
