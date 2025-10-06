import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import {
  whileThisCharacterHasNoDamageGains,
  whileThisCharacterHasNoDamageGets,
} from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const nalaUndauntedLioness: LorcanaCharacterCardDefinition = {
  id: "dg0",
  name: "Nala",
  title: "Undaunted Lioness",
  characteristics: ["storyborn", "ally"],
  text: "DETERMINED DIVERSION While this character has no damage, she gets +1 {L} and gains Resist +1. (Damage dealt to them is reduced by 1.)",
  type: "character",
  inkwell: false,
  colors: ["steel"],
  cost: 2,
  strength: 0,
  willpower: 2,
  illustrator: "Eri Welli",
  number: 173,
  set: "009",
  rarity: "rare",
  abilities: [
    whileThisCharacterHasNoDamageGains({
      name: "Determined Diversion",
      text: "While this character has no damage, she gets +1 {L} and gains Resist +1.",
      ability: resistAbility(1),
    }),
    whileThisCharacterHasNoDamageGets({
      name: "Determined Diversion",
      text: "While this character has no damage, she gets +1 {L} and gains Resist +1.",
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          amount: 1,
          modifier: "add",
          duration: "static",
          target: thisCharacter,
        },
      ],
    }),
  ],
  lore: 2,
};
