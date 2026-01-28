import type { UnitCardDefinition } from "@tcg/gundam-types";

export const CgsMobileWorker: UnitCardDefinition = {
  id: "st05-003",
  name: "CGS Mobile Worker",
  cardNumber: "ST05-003",
  setCode: "ST05",
  cardType: "UNIT",
  rarity: "common",
  level: 1,
  cost: 1,
  text: "【Activate･Main】Rest this Unit：Choose 1 of your Units. Deal 1 damage to it. It gets AP+1 during this turn.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST05-003.webp?2510031",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  ap: Number.NaN,
  hp: 2,
  zones: ["earth"],
  traits: ["tekkadan"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "eff-d95r2sm5p",
      type: "ACTIVATED",
      timing: "MAIN",
      description:
        "Rest this Unit:Choose 1 of your Units. Deal 1 damage to it. It gets AP+1 during this turn.",
      restrictions: [],
      costs: [
        {
          type: "REST_SELF",
          amount: 1,
        },
      ],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "DAMAGE",
            value: 1,
            target: {
              controller: "SELF",
              cardType: "UNIT",
              count: {
                min: 1,
                max: 1,
              },
              filters: [],
            },
          },
          {
            type: "MODIFY_STATS",
            attribute: "AP",
            value: 1,
            duration: "TURN",
            target: {
              controller: "SELF",
              cardType: "UNIT",
              count: {
                min: 1,
                max: 1,
              },
              filters: [],
            },
          },
        ],
      },
    },
  ],
};
