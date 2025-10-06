// TODO: Once the set is released, we organize the cards by set and type

import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const auntCassBiggestFan: LorcanaCharacterCardDefinition = {
  id: "q8p",
  missingTestCase: true,
  name: "Aunt Cass",
  title: "Biggest Fan",
  characteristics: ["storyborn", "mentor"],
  text: "HAPPY TO HELP Whenever this character quests, chosen Inventor character gets +1 {L} this turn.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "Happy to Help",
      text: "Whenever this character quests, chosen Inventor character gets +1 {L} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          amount: 1,
          modifier: "add",
          duration: "turn",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "characteristics", value: ["inventor"] },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Kendall Hale",
  number: 138,
  set: "006",
  rarity: "common",
};
