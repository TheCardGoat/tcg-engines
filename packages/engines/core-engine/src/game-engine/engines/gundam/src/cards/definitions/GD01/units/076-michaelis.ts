import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-076",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 76,
  name: "Michaelis",
  color: "white",
  set: "GD01",
  rarity: "uncommon",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirement: ["(academy) trait"],
  ap: 3,
  hp: 3,
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "attribute-boost",
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
          attribute: "AP",
          amount: 1,
          duration: "turn",
          targetText:
            "While there are 4 or more Command cards in your trash, this Unit",
          originalText:
            "While there are 4 or more Command cards in your trash, this Unit gets AP+1",
        },
      ],
      text: "While there are 4 or more Command cards in your trash, this Unit gets AP+1 and HP+1.",
      dependentEffects: false,
      resolveEffectsIndividually: false,
    },
  ],
};
