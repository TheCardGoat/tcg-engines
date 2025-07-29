import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const bePrepared: LorcanitoActionCard = {
  id: "z06",
  name: "Be Prepared",
  characteristics: ["action", "song"],
  text: "_(A character with cost 7 or more can {E} to sing this\nsong for free.)_\nBanish all characters.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Be Prepared",
      text: "Banish all characters.",
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "play" },
              { filter: "type", value: "character" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "Out teeth and ambitions are bared!",
  colors: ["ruby"],
  cost: 7,
  illustrator: "Jared Nickerl",
  number: 128,
  set: "TFC",
  rarity: "rare",
};
