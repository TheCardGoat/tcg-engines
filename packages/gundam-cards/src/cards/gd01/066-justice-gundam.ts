import type { UnitCardDefinition } from "@tcg/gundam-types";

export const JusticeGundam: UnitCardDefinition = {
  id: "gd01-066",
  name: "Justice Gundam",
  cardNumber: "GD01-066",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "legendary",
  color: "white",
  level: 7,
  cost: 5,
  text: "【Deploy】Deploy 1 [Fatum-00]((Triple Ship Alliance)･AP2･HP2･<Blocker>) Unit token.\n【During Pair】【Attack】Choose 1 of your (Triple Ship Alliance) Unit tokens. It may attack on the turn it is deployed.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-066.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 5,
  hp: 5,
  zones: ["space", "earth"],
  traits: ["triple", "ship", "alliance"],
  linkRequirements: ["athrun-zala"],
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  effects: [
    {
      id: "eff-5k92uiimm",
      type: "TRIGGERED",
      timing: "DEPLOY",
      description:
        "Deploy 1 [Fatum-00]((Triple Ship Alliance)･AP2･HP2･) Unit token.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "DEPLOY",
      },
    },
    {
      id: "eff-xaarya3a8",
      type: "TRIGGERED",
      timing: "ATTACK",
      description:
        "Choose 1 of your (Triple Ship Alliance) Unit tokens. It may attack on the turn it is deployed.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "may attack on the turn it is deployed.",
      },
    },
  ],
};
