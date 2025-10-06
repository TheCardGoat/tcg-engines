import { lumiereFieryFriend as ogLumiereFieryFriend } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/113-lumiere-fiery-friend";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lumiereFieryFriend: LorcanaCharacterCardDefinition = {
  ...ogLumiereFieryFriend,
  id: "bk1",
  reprints: [ogLumiereFieryFriend.id],
  number: 121,
  set: "009",
};
