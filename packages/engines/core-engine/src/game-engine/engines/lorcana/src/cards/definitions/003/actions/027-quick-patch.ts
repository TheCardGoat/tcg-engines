import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";

export const quickPatch: LorcanitoActionCard = {
  id: "p6z",
  missingTestCase: true,
  name: "Quick Patch",
  characteristics: ["action"],
  text: "Remove up to 3 damage from chosen location.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "heal",
          amount: 3,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "location" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "Good as new! Well, almost.",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  illustrator: "Wouter Bruneel",
  number: 27,
  set: "ITI",
  rarity: "common",
};
