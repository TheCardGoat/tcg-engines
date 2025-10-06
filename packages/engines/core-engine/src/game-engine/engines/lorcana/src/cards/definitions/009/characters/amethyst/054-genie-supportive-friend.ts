import { genieSupportiveFriend as genieSupportiveFriendAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const genieSupportiveFriend: LorcanitoCharacterCardDefinition = {
  ...genieSupportiveFriendAsOrig,
  id: "gm5",
  reprints: [genieSupportiveFriendAsOrig.id],
  number: 54,
  set: "009",
};
