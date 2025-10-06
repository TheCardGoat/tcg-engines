import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const prideLandsJungleOasis: LorcanaLocationCardDefinition = {
  id: "peo",
  name: "Pride Lands",
  title: "Jungle Oasis",
  characteristics: ["location"],
  text: "**OUR HUMBLE HOME** While you have 3 or more characters here, you may banish this location to play a character from your discard for free.",
  type: "location",
  abilities: [
    {
      type: "activated",
      name: "**OUR HUMBLE HOME**",
      text: "While you have 3 or more characters here, you may banish this location to play a character from your discard for free.",
      costs: [{ type: "banish" }],
      conditions: [
        {
          type: "chars-at-location",
          comparison: { operator: "gte", value: 3 },
        },
      ],
      effects: [
        {
          type: "play",
          forFree: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "zone", value: "discard" },
              { filter: "type", value: "character" },
            ],
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  willpower: 8,
  lore: 1,
  illustrator: "Matthew Oates",
  number: 34,
  set: "SSK",
  rarity: "rare",
  moveCost: 2,
};
