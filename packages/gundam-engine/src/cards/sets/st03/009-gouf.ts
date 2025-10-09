import type { UnitCardDefinition } from "../../card-types";

export const Gouf: UnitCardDefinition = {
  id: "st03-009",
  name: "Gouf",
  cardNumber: "ST03-009",
  setCode: "ST03",
  cardType: "UNIT",
  rarity: "common",
  color: "green",
  level: 3,
  cost: 3,
  text: "【Deploy】Deploy 1 rested [Zaku Ⅱ]((Zeon)･AP1･HP1) Unit token.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST03-009.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 2,
  hp: 3,
  zones: ["earth"],
  traits: ["zeon"],
  linkRequirements: ["ramba-ral"],
  abilities: [
    {
      trigger: "ON_DEPLOY",
      description:
        "【Deploy】 Deploy 1 rested [Zaku Ⅱ]((Zeon)･AP1･HP1) Unit token.",
      effect: {
        type: "UNKNOWN",
        rawText: "Deploy 1 rested [Zaku Ⅱ]((Zeon)･AP1･HP1) Unit token.",
      },
    },
  ],
};
