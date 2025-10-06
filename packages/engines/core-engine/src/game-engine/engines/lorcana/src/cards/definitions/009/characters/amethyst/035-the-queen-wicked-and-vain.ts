import { theQueenWickedAndVain as ogTheQueenWickedAndVain } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/056-the-queen-wicked-and-vain";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theQueenWickedAndVain: LorcanitoCharacterCardDefinition = {
  ...ogTheQueenWickedAndVain,
  id: "k4l",
  reprints: [ogTheQueenWickedAndVain.id],
  number: 35,
  set: "009",
};
