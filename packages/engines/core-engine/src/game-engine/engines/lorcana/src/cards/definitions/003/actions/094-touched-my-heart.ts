import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";

export const touchedMyHeart: LorcanaActionCardDefinition = {
  id: "ee8",
  name: "Has Set My Heaaaaaaart ...",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\n\n\nBanish chosen item.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Banish chosen item.",
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: ["item"] },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  flavour:
    "He's not real smart, and yet, \nhe's touched my little cowhide heart.",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Hyuna Lee",
  number: 94,
  set: "ITI",
  rarity: "uncommon",
};
