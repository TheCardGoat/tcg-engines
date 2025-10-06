// TODO: Once the set is released, we organize the cards by set and type

import { yourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const aladdinIntrepidCommander: LorcanaCharacterCardDefinition = {
  id: "zw4",
  missingTestCase: true,
  name: "Aladdin",
  title: "Intrepid Commander",
  characteristics: ["floodborn", "hero", "prince"],
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Aladdin.)\nREMEMBER YOUR TRAINING When you play this character, your characters get +2 {S} this turn.",
  type: "character",
  abilities: [
    shiftAbility(2, "aladdin"),
    {
      type: "resolution",
      name: "Remember Your Training",
      text: "When you play this character, your characters get +2 {S} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "add",
          target: yourCharacters,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  illustrator: "Alice Pisoni",
  number: 119,
  set: "006",
  rarity: "uncommon",
};
