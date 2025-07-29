import type {
  DamageEffect,
  LorcanitoActionCard,
} from "@lorcanito/lorcana-engine";

export const baBoom: LorcanitoActionCard = {
  id: "oaj",
  name: "Ba-Boom!",
  characteristics: ["action"],
  text: "Deal 2 damage to chosen character or location.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Ba-Boom!",
      text: "Deal 2 damage to chosen character or location.",
      effects: [
        {
          type: "damage",
          amount: 2,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: ["location", "character"] },
              { filter: "zone", value: "play" },
            ],
          },
        } as DamageEffect,
      ],
    },
  ],
  flavour: "Bigger than your average boom!",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  illustrator: "Heidi Neunhoffer",
  number: 196,
  set: "ITI",
  rarity: "common",
};
