import { queenOfHeartsWonderlandEmpress as ogQueenOfHeartsWonderlandEmpress } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const queenOfHeartsWonderlandEmpress: LorcanitoCharacterCardDefinition =
  {
    ...ogQueenOfHeartsWonderlandEmpress,
    id: "ifp",
    reprints: [ogQueenOfHeartsWonderlandEmpress.id],
    number: 23,
    set: "009",
  };
