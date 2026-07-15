import type { UnitCardDefinition } from "@tcg/gundam-types";

export const ZakuISniperType: UnitCardDefinition = {
  ap: Number.NaN,
  cardNumber: "GD01-048",
  cardType: "UNIT",
  color: "red",
  cost: 2,
  hp: 1,
  id: "gd01-048",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-048.webp?26013001",
  keywords: [
    {
      keyword: "Support",
      value: 1,
    },
  ],
  level: 2,
  linkRequirements: ["(zeon)-trait"],
  name: "Zaku I Sniper Type",
  rarity: "rare",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  text: "【Activate･Main】<Support 1> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)\n【Deploy】Look at the top card of your deck. If it is a (Zeon)/(Neo Zeon) Unit card, you may reveal it and add it to your hand. Return any remaining card to the bottom of your deck.",
  traits: ["zeon"],
  zones: ["space", "earth"],
};
