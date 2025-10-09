import type { UnitCardDefinition } from "../../card-types";

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
  abilities: [
    {
      activated: {
        timing: "MAIN",
      },
      description:
        "【Activate･Main】 Rest this Unit：Choose 1 of your Units. Deal 1 damage to it. It gets AP+1 during this turn.",
      effect: {
        type: "DAMAGE",
        amount: 1,
        target: {
          type: "unknown",
          rawText: "it",
        },
      },
    },
  ],
};
