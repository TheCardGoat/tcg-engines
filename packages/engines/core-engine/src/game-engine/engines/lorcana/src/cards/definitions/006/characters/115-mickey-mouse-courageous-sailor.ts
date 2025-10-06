// TODO: Once the set is released, we organize the cards by set and type

import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whileCharacterIsAtLocationItGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMouseCourageousSailor: LorcanaCharacterCardDefinition = {
  id: "meu",
  missingTestCase: true,
  name: "Mickey Mouse",
  title: "Courageous Sailor",
  characteristics: ["dreamborn", "hero"],
  text: "SOLID GROUND While this character is at a location, he gets +2 {S}.",
  type: "character",
  abilities: [
    whileCharacterIsAtLocationItGets({
      name: "Solid Ground",
      text: "While this character is at a location, he gets +2 {S}.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "add",
          target: thisCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  illustrator: "Kenneth Anderson",
  number: 115,
  set: "006",
  rarity: "common",
};
