import type { UnitCardDefinition } from "../../card-types";

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
  text: "【Activate･Main】&lt;Support 1&gt; (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)
【Deploy】Look at the top card of your deck. If it is a (Zeon)/(Neo Zeon) Unit card, you may reveal it and add it to your hand. Return any remaining card to the bottom of your deck.
",
  imageUrl: "../images/cards/card/GD01-048.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: NaN,
  hp: 1,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "zeon",
  ],
  linkRequirements: [
    "(zeon)-trait",
  ],
  keywords: [
    {
      keyword: "Support",
      value: 1,
    },
  ],
  abilities: [
    {
      activated: {
        timing: "MAIN",
      },
      description: "【Activate･Main】 <Support 1> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
      effect: {
        type: "UNKNOWN",
        rawText: "<Support 1> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
      },
    },
    {
      trigger: "ON_DEPLOY",
      description: "【Deploy】 Look at the top card of your deck. If it is a (Zeon)/(Neo Zeon) Unit card, you may reveal it and add it to your hand. Return any remaining card to the bottom of your deck.",
      effect: {
        type: "UNKNOWN",
        rawText: "Look at the top card of your deck. If it is a (Zeon)/(Neo Zeon) Unit card, you may reveal it and add it to your hand. Return any remaining card to the bottom of your deck.",
      },
    },
  ],
};
