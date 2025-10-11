import type { GundamitoUnitCard } from "../../cardTypes";

export const card: GundamitoUnitCard = {
  id: "GD01-042",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 2,
  number: 42,
  name: "Duo&#039;s Leo",
  color: "green",
  set: "GD01",
  rarity: "common",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["duo maxwell"],
  ap: 2,
  hp: 2,
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "targeting",
          amount: "an",
          target: {
            type: "unit",
            value: 1,
            filters: [
              {
                filter: "type",
                value: "unit",
              },
            ],
            zone: "battlefield",
            isMultiple: false,
          },
          condition: "",
          targetText: "active enemy Unit that is Lv",
          originalText: "choose an active enemy Unit that is Lv.",
        },
      ],
      text: "This Unit may choose an active enemy Unit that is Lv.",
      dependentEffects: false,
      resolveEffectsIndividually: false,
    },
  ],
};
