import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { beOurGuest as ogBeOurGuest } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/025-be-our-guest";

export const beOurGuest: LorcanaActionCardDefinition = {
  ...ogBeOurGuest,
  id: "cwb",
  reprints: [ogBeOurGuest.id],
  number: 31,
  set: "009",
};
