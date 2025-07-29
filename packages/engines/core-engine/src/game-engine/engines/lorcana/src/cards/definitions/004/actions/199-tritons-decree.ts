import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";

export const tritonsDecree: LorcanitoActionCard = {
  id: "lu9",
  missingTestCase: true,
  name: "Triton's Decree",
  characteristics: ["action"],
  text: "Each opponent chooses one of their characters and deals 2 damage to them.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Each opponent chooses one of their characters and deals 2 damage to them.",
      responder: "opponent",
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
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "Ursula's foul creatures are not welcome in my kingdom!",
  colors: ["steel"],
  cost: 1,
  illustrator: "Carlos Gomes Cabral",
  number: 199,
  set: "URR",
  rarity: "common",
};
