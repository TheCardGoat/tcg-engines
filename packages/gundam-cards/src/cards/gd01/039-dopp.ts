import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Dopp: UnitCardDefinition = {
  id: "gd01-039",
  name: "Dopp",
  cardNumber: "GD01-039",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "green",
  level: 1,
  cost: 1,
  text: "【Deploy】Look at the top card of your deck. Return it to the top or bottom of your deck.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-039.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 1,
  hp: 1,
  zones: ["earth"],
  traits: ["zeon"],
  linkRequirements: ["-"],
  abilities: [
    {
      trigger: "ON_DEPLOY",
      description:
        "【Deploy】 Look at the top card of your deck. Return it to the top or bottom of your deck.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "Look at the top card of your deck. Return it to the top or bottom of your deck.",
      },
    },
  ],
};
