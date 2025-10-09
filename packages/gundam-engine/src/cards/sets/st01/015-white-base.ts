import type { BaseCardDefinition_Structure } from "../../card-types";

export const WhiteBase: BaseCardDefinition_Structure = {
  id: "st01-015",
  name: "White Base",
  cardNumber: "ST01-015",
  setCode: "ST01",
  cardType: "BASE",
  rarity: "common",
  color: "blue",
  level: 3,
  cost: 2,
  text: "【Burst】Deploy this card.
【Deploy】Add 1 of your Shields to your hand.<br />
【Activate･Main】【Once per Turn】②：Deploy 1 [Gundam]((White Base Team)･AP3･HP3) Unit token if you have no Units in play, deploy 1 [Guncannon]((White Base Team)･AP2･HP2) Unit token if you have only 1 Unit in play, or deploy 1 [Guntank]((White Base Team)･AP1･HP1) Unit token if you have 2 or more Units in play.
",
  imageUrl: "../images/cards/card/ST01-015.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: NaN,
  hp: 5,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "earth",
    "federation",
    "white",
    "base",
    "team",
    "warship",
  ],
  abilities: [
    {
      trigger: "ON_BURST",
      description: "【Burst】 Deploy this card.",
      effect: {
        type: "UNKNOWN",
        rawText: "Deploy this card.",
      },
    },
    {
      trigger: "ON_DEPLOY",
      description: "【Deploy】 Add 1 of your Shields to your hand.<br />",
      effect: {
        type: "UNKNOWN",
        rawText: "Add 1 of your Shields to your hand.<br />",
      },
    },
    {
      activated: {
        timing: "MAIN",
      },
      description: "【Activate･Main】 【Once per Turn】②：Deploy 1 [Gundam]((White Base Team)･AP3･HP3) Unit token if you have no Units in play, deploy 1 [Guncannon]((White Base Team)･AP2･HP2) Unit token if you have only 1 Unit in play, or deploy 1 [Guntank]((White Base Team)･AP1･HP1) Unit token if you have 2 or more Units in play.",
      effect: {
        type: "UNKNOWN",
        rawText: "【Once per Turn】②：Deploy 1 [Gundam]((White Base Team)･AP3･HP3) Unit token if you have no Units in play, deploy 1 [Guncannon]((White Base Team)･AP2･HP2) Unit token if you have only 1 Unit in play, or deploy 1 [Guntank]((White Base Team)･AP1･HP1) Unit token if you have 2 or more Units in play.",
      },
    },
  ],
};
