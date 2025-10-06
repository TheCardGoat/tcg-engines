// TODO: Once the set is released, we organize the cards by set and type

import {
  exertChosenItem,
  exertedItemCantReadyNextTurn,
} from "@lorcanito/lorcana-engine/effects/effects";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { whileConditionThisCharacterGains } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const heiheiNotsotrickyChicken: LorcanaCharacterCardDefinition = {
  id: "njq",
  missingTestCase: true,
  name: "Heihei",
  title: "Not-So-Tricky Chicken",
  characteristics: ["storyborn", "ally"],
  text: "EAT ANYTHING When you play this character, exert chosen opposing item. It can't ready at the start of its next turn.\nOUT TO LUNCH During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Eat Anything",
      text: "When you play this character, exert chosen opposing item. It can't ready at the start of its next turn.",
      effects: [exertChosenItem, exertedItemCantReadyNextTurn],
    },
    whileConditionThisCharacterGains({
      name: "Out To Lunch",
      text: "During your turn, this character gains **Evasive**. (_They can challenge characters with Evasive._)",
      ability: evasiveAbility,
      conditions: [
        {
          type: "during-turn",
          value: "self",
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Lisanne Koeteuw",
  number: 146,
  set: "006",
  rarity: "uncommon",
};
