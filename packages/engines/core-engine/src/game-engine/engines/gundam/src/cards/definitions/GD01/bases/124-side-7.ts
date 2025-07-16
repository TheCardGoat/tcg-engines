import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-124",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 1,
  number: 124,
  name: "Side 7",
  color: "blue",
  set: "GD01",
  rarity: "common",
  type: "base",
  zones: ["space"],
  traits: ["earth federation", "stronghold"],
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
          targetText: "friendly Unit",
          originalText: "Choose 1 friendly Unit.",
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
          targetText: "this Base：Choose 1 friendly Unit.",
          originalText: "Rest this Base：Choose 1 friendly Unit.",
        },
      ],
      trigger: {
        event: "activate･main",
      },
      text: "【activate･main】",
    },
  ],
  ap: 0,
  hp: 4,
};
