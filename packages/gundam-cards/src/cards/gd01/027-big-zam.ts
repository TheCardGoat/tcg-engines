import type { UnitCardDefinition } from "@tcg/gundam-types";

export const BigZam: UnitCardDefinition = {
  id: "gd01-027",
  name: "Big Zam",
  cardNumber: "GD01-027",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "green",
  level: 7,
  cost: 5,
  text: "<Breach 4> (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)\n【Deploy】If there are 10 or more (Zeon)/(Neo Zeon) Unit cards in your trash, deal 4 damage to all Units with <Blocker>.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-027.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 5,
  hp: 6,
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirements: ["dozle-zabi"],
  keywords: [
    {
      keyword: "Breach",
      value: 4,
    },
    {
      keyword: "Blocker",
    },
  ],
  effects: [
    {
      id: "gd01-027-effect-1",
      description:
        "【Deploy】 If there are 10 or more (Zeon)/(Neo Zeon) Unit cards in your trash, deal 4 damage to all Units with <Blocker>.",
      type: "TRIGGERED",
      timing: "DEPLOY",
      action: {
        type: "DAMAGE",
        parameters: {
          target: {
            type: "unknown",
            rawText: "all Units with <Blocker>",
          },
          amount: 4,
        },
      },
    },
  ],
};
