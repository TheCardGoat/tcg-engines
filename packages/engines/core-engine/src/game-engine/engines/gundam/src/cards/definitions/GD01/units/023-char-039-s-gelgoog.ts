import type { GundamitoUnitCard } from "../../cardTypes";

export const card: GundamitoUnitCard = {
  id: "GD01-023",
  implemented: false,
  missingTestCase: true,
  cost: 4,
  level: 4,
  number: 23,
  name: "Char&#039;s Gelgoog",
  color: "green",
  set: "GD01",
  rarity: "legendary",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirement: ["char aznable"],
  ap: 4,
  hp: 3,
  abilities: [
    {
      type: "triggered",
      effects: [
        {
          type: "discard",
          amount: 1,
          originalText: "Discard 1",
        },
        {
          type: "targeting",
          amount: "1",
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
          targetText: "(Newtype) Pilot card that is Lv",
          originalText: "choose 1 (Newtype) Pilot card that is Lv.",
        },
        {
          type: "rule",
          ruleText: "Zeon",
          originalText: "(Zeon)",
        },
        {
          type: "rule",
          ruleText: "Neo Zeon",
          originalText: "(Neo Zeon)",
        },
        {
          type: "rule",
          ruleText: "Newtype",
          originalText: "(Newtype)",
        },
      ],
      trigger: {
        event: "activate･main",
      },
      text: "【activate･main】",
    },
  ],
};
