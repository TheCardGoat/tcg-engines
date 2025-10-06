import { oneJumpAhead as ogOneJumpAhead } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/164-one-jump-ahead";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const oneJumpAhead: LorcanaActionCardDefinition = {
  ...ogOneJumpAhead,
  id: "uhq",
  reprints: [ogOneJumpAhead.id],
  number: 165,
  set: "009",
};
