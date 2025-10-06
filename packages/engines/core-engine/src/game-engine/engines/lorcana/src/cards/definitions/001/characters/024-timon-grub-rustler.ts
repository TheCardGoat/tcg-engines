import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const timonGrubRustler: LorcanitoCharacterCardDefinition = {
  id: "bzz",
  name: "Timon",
  title: "Grub Rustler",
  characteristics: ["storyborn", "ally"],
  text: "**TASTES LIKE CHICKEN** When you play this character, you may remove up to 1 damage from chosen character.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "TASTES LIKE CHICKEN",
      text: "When you play this character, you may remove up to 1 damage from chosen character.",
      optional: true,
      effects: [
        {
          type: "heal",
          amount: 1,
          target: chosenCharacter,
        },
      ],
    }),
  ],
  flavour:
    "There's all manner of tasty treats in the world−ya just gotta know where to look.",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  illustrator: "Juan Diego Leon",
  number: 24,
  set: "TFC",
  rarity: "common",
};
