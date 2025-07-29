import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const fireTheCannons: LorcanitoActionCard = {
  id: "lhl",
  name: "Fire the Cannons!",
  characteristics: ["action"],
  text: "Deal 2 damage to chosen character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Fire the Cannons!",
      text: "Deal 2 damage to chosen character.",
      effects: [
        {
          type: "damage",
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
  flavour:
    "Captain Hook: „Double the powder and shorten the\rfuse!<br />Mr. Smee: „Shorten the powder and double the fuse!",
  colors: ["steel"],
  cost: 1,
  illustrator: "Matt Chapman",
  number: 197,
  set: "TFC",
  rarity: "common",
};
