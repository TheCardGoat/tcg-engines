import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { oneJumpAhead as ogOneJumpAhead } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/164-one-jump-ahead";

export const oneJumpAhead: LorcanaActionCardDefinition = {
  ...ogOneJumpAhead,
  id: "uhq",
  reprints: [ogOneJumpAhead.id],
  number: 165,
  set: "009",
};
