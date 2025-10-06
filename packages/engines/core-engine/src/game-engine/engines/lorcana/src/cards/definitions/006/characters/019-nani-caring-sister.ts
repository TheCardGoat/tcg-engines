// TODO: Once the set is released, we organize the cards by set and type

import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const naniCaringSister: LorcanaCharacterCardDefinition = {
  id: "m9x",
  missingTestCase: true,
  name: "Nani",
  title: "Caring Sister",
  characteristics: ["storyborn", "hero"],
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)\nI AM SO SORRY 2 {I} - Chosen character gets -1 {S} until the start of your next turn.",
  type: "character",
  abilities: [
    supportAbility,
    {
      type: "activated",
      costs: [{ type: "ink", amount: 2 }],
      name: "I Am So Sorry",
      text: "Chosen character gets -1 {S} until the start of your next turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 1,
          modifier: "subtract",
          target: chosenCharacter,
          until: true,
          duration: "next_turn",
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  illustrator: "Carmine Pucci",
  number: 19,
  set: "006",
  rarity: "rare",
};
