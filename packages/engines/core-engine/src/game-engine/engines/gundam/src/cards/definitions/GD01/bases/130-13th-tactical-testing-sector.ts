import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-130",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 130,
  name: "13th Tactical Testing Sector",
  color: "white",
  set: "GD01",
  rarity: "common",
  type: "base",
  zones: ["space"],
  traits: ["academy", "stronghold"],
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
        event: "burst",
      },
      text: "【burst】",
    },
    {
      type: "triggered",
      effects: [
        {
          type: "move-to-hand",
          target: {
            type: "unit",
            value: 1,
            filters: [
              {
                filter: "type",
                value: "unit",
              },
              {
                filter: "owner",
                value: "self",
              },
            ],
            zone: "battlefield",
            isMultiple: false,
          },
          targetText: "1 of your Shields",
          originalText: "Add 1 of your Shields to your hand",
        },
      ],
      trigger: {
        event: "deploy",
      },
      text: "【deploy】",
    },
    {
      type: "triggered",
      effects: [
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
          targetText: "enemy Unit",
          originalText: "choose 1 enemy Unit.",
        },
        {
          type: "rest",
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
          targetText:
            "this Base：If a friendly (Academy) Unit is in play, choose 1 enemy Unit.",
          originalText:
            "Rest this Base：If a friendly (Academy) Unit is in play, choose 1 enemy Unit.",
        },
        {
          type: "rule",
          ruleText: "Academy",
          originalText: "(Academy)",
        },
      ],
      trigger: {
        event: "activate･main",
      },
      text: "【activate･main】",
    },
  ],
  ap: 0,
  hp: 5,
};
