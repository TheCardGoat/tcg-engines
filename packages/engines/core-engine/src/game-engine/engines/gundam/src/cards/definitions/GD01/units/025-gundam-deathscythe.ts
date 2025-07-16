import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-025",
  implemented: false,
  missingTestCase: true,
  cost: 4,
  level: 6,
  number: 25,
  name: "Gundam Deathscythe",
  color: "green",
  set: "GD01",
  rarity: "legendary",
  type: "unit",
  zones: ["earth"],
  traits: [],
  linkRequirement: ["duo maxwell"],
  ap: 5,
  hp: 4,
  abilities: [
    {
      type: "triggered",
      effects: [
        {
          type: "placeholder",
          parameters: {},
        },
      ],
      trigger: {
        event: "when-paired･(operation-meteor)-pilot",
      },
      text: "【When Paired･(Operation Meteor) Pilot】",
    },
  ],
};
