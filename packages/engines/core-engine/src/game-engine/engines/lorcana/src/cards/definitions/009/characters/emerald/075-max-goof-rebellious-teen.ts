import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const maxGoofRebelliousTeen: LorcanitoCharacterCardDefinition = {
  id: "ctx",
  // notImplemented: true,
  missingTestCase: false,
  name: "Max Goof",
  title: "Rebellious Teen",
  characteristics: ["storyborn", "hero"],
  text: "PERSONAL SOUNDTRACK When you play this character, you may pay 1 {I} to return a song card with cost 3 or less from your discard to your hand.",
  type: "character",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 2,
  willpower: 2,
  illustrator: "Rodrigo Camilo",
  number: 75,
  set: "009",
  rarity: "rare",
  lore: 1,
  abilities: [
    {
      type: "resolution",
      name: "PERSONAL SOUNDTRACK",
      text: "When you play this character, you may pay 1 {I} to return a song card with cost 3 or less from your discard to your hand.",
      optional: true,
      costs: [{ type: "ink", amount: 1 }],
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "discard" },
              { filter: "type", value: "action" },
              { filter: "characteristics", value: ["song"] },
              { filter: "owner", value: "self" },
              {
                filter: "attribute",
                value: "cost",
                comparison: { operator: "lte", value: 3 },
              },
            ],
          },
        },
      ],
    },
  ],
};
