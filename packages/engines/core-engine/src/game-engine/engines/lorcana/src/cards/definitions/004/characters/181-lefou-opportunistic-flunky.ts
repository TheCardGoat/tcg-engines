import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lefouOpportunisticFlunky: LorcanaCharacterCardDefinition = {
  id: "at9",
  name: "Lefou",
  title: "Opportunistic Flunky",
  characteristics: ["dreamborn", "ally"],
  text: "**I LEARNED FROM THE BEST** During your turn, you may play this character for free if an opposing character was banished in a challenge this turn.",
  type: "character",
  abilities: [
    {
      type: "static",
      conditions: [
        {
          type: "during-turn",
          value: "self",
        },
        {
          type: "this-turn",
          value: "has-challenged",
          target: "self",
        },
      ],
      ability: "effects",
      name: "I Learned From The Best",
      text: "During your turn, you may play this character for free if an opposing character was banished in a challenge this turn.",
      effects: [
        {
          type: "replacement",
          replacement: "cost",
          duration: "static",
          amount: 3,
          target: thisCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Kendall Hale",
  number: 181,
  set: "URR",
  rarity: "rare",
};
