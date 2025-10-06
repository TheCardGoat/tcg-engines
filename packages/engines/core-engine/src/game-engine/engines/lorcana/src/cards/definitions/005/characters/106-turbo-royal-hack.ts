import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const turboRoyalHack: LorcanitoCharacterCardDefinition = {
  id: "k3a",
  name: "Turbo",
  title: "Royal Hack",
  characteristics: ["storyborn", "villain", "racer"],
  text: "**Rush** _(This character can challenge the turn they’re played.)_ **GAME JUMP** This character also counts as being named King Candy for **Shift**.",
  type: "character",
  abilities: [
    rushAbility,
    // {
    //   implemented directly on canShift
    //   name: "**GAME JUMP** This character also counts as being named King Candy for **Shift**.",
    // },
  ],
  colors: ["ruby"],
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Juan Diego Leon",
  number: 106,
  set: "SSK",
  rarity: "uncommon",
};
