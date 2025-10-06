import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whileThisCharacterHasDamageGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ratiganRagingRat: LorcanaCharacterCardDefinition = {
  id: "qhl",
  missingTestCase: true,
  name: "Ratigan",
  title: "Raging Rat",
  characteristics: ["dreamborn", "villain"],
  text: "**NOTHING CAN STAND IN MY WAY** While this character has damage, he gets +2 {S}.",
  type: "character",
  abilities: [
    whileThisCharacterHasDamageGets({
      name: "Nothing can stand in my way",
      text: "While this character has damage, he gets +2 {S}.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "add",
          duration: "static",
          target: thisCharacter,
        },
      ],
    }),
  ],
  flavour:
    "The world’s most diabolical genius should never suffer such indignities!",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 1,
  willpower: 5,
  lore: 1,
  illustrator: "Adam Fenton",
  number: 113,
  set: "SSK",
  rarity: "common",
};
