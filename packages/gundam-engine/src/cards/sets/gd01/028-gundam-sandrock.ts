import type { UnitCardDefinition } from "../../card-types";

export const GundamSandrock: UnitCardDefinition = {
  id: "gd01-028",
  name: "Gundam Sandrock",
  cardNumber: "GD01-028",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "green",
  level: 5,
  cost: 3,
  text: "【Deploy】You may deploy 1 (Maganac Corps) Unit card from your hand.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-028.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 4,
  hp: 4,
  zones: ["earth"],
  traits: ["operation", "meteor"],
  linkRequirements: ["quatre-raberba-winner"],
  abilities: [
    {
      trigger: "ON_DEPLOY",
      description:
        "【Deploy】 You may deploy 1 (Maganac Corps) Unit card from your hand.",
      effect: {
        type: "UNKNOWN",
        rawText: "You may deploy 1 (Maganac Corps) Unit card from your hand.",
      },
    },
  ],
};
