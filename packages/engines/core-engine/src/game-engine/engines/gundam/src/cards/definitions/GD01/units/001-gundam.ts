import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-001",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 1,
  name: "Gundam",
  color: "blue",
  set: "GD01",
  rarity: "legendary",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["amuro ray"],
  ap: 3,
  hp: 3,
  abilities: [
    {
      type: "continuous",
      effects: [
        {
          type: "keyword",
          keyword: "Repair",
          value: 1,
        },
      ],
      text: "<Repair 1>",
    },
    {
      type: "triggered",
      effects: [
        {
          type: "draw",
          amount: 1,
        },
      ],
      trigger: {
        event: "when-paired",
      },
      text: "【when paired】",
    },
    {
      type: "resolution",
      effects: [
        {
          type: "rule",
          ruleText: "white Base Team",
          originalText: "(white Base Team)",
        },
      ],
      text: "All your (white Base Team) Units gain .",
      dependentEffects: false,
      resolveEffectsIndividually: false,
    },
  ],
};
