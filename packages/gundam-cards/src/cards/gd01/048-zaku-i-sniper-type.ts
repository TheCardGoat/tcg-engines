import type { UnitCardDefinition } from "@tcg/gundam-types";

export const ZakuISniperType: UnitCardDefinition = {
  id: "gd01-048",
  name: "Zaku I Sniper Type",
  cardNumber: "GD01-048",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "red",
  level: 2,
  cost: 2,
  text: "【Activate･Main】<Support 1> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)\n【Deploy】Look at the top card of your deck. If it is a (Zeon)/(Neo Zeon) Unit card, you may reveal it and add it to your hand. Return any remaining card to the bottom of your deck.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-048.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: Number.NaN,
  hp: 1,
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirements: ["(zeon)-trait"],
  keywords: [
    {
      keyword: "Support",
      value: 1,
    },
  ],
  effects: [
    {
      id: "gd01-048-effect-1",
      description:
        "【Activate･Main】 <Support 1> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
      type: "ACTIVATED",
      timing: "MAIN",
      action: {
        type: "CUSTOM",
        text: "<Support 1> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
      },
    },
    {
      id: "gd01-048-effect-2",
      description:
        "【Deploy】 Look at the top card of your deck. If it is a (Zeon)/(Neo Zeon) Unit card, you may reveal it and add it to your hand. Return any remaining card to the bottom of your deck.",
      type: "TRIGGERED",
      timing: "DEPLOY",
      action: {
        type: "CUSTOM",
        text: "Look at the top card of your deck. If it is a (Zeon)/(Neo Zeon) Unit card, you may reveal it and add it to your hand. Return any remaining card to the bottom of your deck.",
      },
    },
  ],
};
