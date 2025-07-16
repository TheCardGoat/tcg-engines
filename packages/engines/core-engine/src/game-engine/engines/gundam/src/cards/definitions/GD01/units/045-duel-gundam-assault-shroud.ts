import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-045",
  implemented: false,
  missingTestCase: true,
  cost: 4,
  level: 5,
  number: 45,
  name: "Duel Gundam (Assault Shroud)",
  color: "red",
  set: "GD01",
  rarity: "legendary",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["yzak jule"],
  ap: 4,
  hp: 4,
  abilities: [
    {
      type: "triggered",
      effects: [
        {
          type: "search",
          target: {
            type: "zone",
            value: "deck",
            filters: [],
          },
          amount: 1,
          searchType: "look",
        },
        {
          type: "rule",
          ruleText: "ZAFT",
          originalText: "(ZAFT)",
        },
      ],
      trigger: {
        event: "when-paired",
      },
      text: "【when paired】",
    },
  ],
};
