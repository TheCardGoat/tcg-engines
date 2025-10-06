import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const princeJohnGoldLover: LorcanitoCharacterCardDefinition = {
  id: "vxl",
  missingTestCase: true,
  name: "Prince John",
  title: "Gold Lover",
  characteristics: ["storyborn", "villain", "prince"],
  text: "**BEAUTIFUL, LOVELY TAXES** {E} – Play an item from your hand or discard with cost 5 or less for free, exerted.",
  type: "character",
  abilities: [
    {
      type: "activated",
      name: "**BEAUTIFUL, LOVELY TAXES** ",
      text: "{E} – Play an item from your hand or discard with cost 5 or less for free, exerted.",
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "play",
          forFree: true,
          exerted: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "zone", value: ["discard", "hand"] },
              { filter: "type", value: "item" },
              {
                filter: "attribute",
                value: "cost",
                comparison: { operator: "lte", value: 5 },
              },
            ],
          },
        },
      ],
    },
  ],
  flavour: "A villainous schemer from day to night.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Koni",
  number: 147,
  set: "SSK",
  rarity: "super_rare",
};
