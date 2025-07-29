import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const healingGlow: LorcanitoActionCard = {
  id: "ta0",
  name: "Healing Glow",
  characteristics: ["action"],
  text: "Remove up to 2 damage from chosen character.",
  type: "action",
  rarity: "common",
  abilities: [
    {
      type: "resolution",
      name: "Healing Glow",
      text: "Remove up to 2 damage from chosen character.",
      effects: [
        {
          type: "heal",
          amount: 2,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "Don't freak out! Rapunzel",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  illustrator: "Philipp Kruse",
  number: 28,
  set: "TFC",
};
