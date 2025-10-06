import { mickeyMouseTrueFriend as ogMickeyMouseTrueFriend } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/012-mickey-mouse-true-friend";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMouseTrueFriend: LorcanitoCharacterCardDefinition = {
  ...ogMickeyMouseTrueFriend,
  id: "c2m",
  reprints: [ogMickeyMouseTrueFriend.id],
  number: 13,
  set: "009",
};
