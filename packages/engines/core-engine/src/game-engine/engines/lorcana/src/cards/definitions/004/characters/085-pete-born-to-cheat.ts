import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const peteBornToCheat: LorcanitoCharacterCardDefinition = {
  id: "fqb",
  missingTestCase: true,
  name: "Pete",
  title: "Born to Cheat",
  characteristics: ["dreamborn", "villain", "musketeer"],
  text: "**I CLOBBER YOU!** Whenever this character quests while he has 5 {S} or more, return chosen character with 2 {S} or less to their player's hand.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "I Clobber You!",
      text: "Whenever this character quests while he has 5 {S} or more, return chosen character with 2 {S} or less to their player's hand.",
      conditions: [
        {
          type: "attribute",
          attribute: "strength",
          comparison: { operator: "gte", value: 5 },
        },
      ],
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              {
                filter: "attribute",
                value: "strength",
                comparison: { operator: "lte", value: 2 },
              },
            ],
          },
        },
      ],
    }),
  ],
  colors: ["emerald"],
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Carlos Luzzi",
  number: 85,
  set: "URR",
  rarity: "super_rare",
};
