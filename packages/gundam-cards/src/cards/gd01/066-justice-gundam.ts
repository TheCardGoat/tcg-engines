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
  abilities: [
    {
      trigger: "ON_DEPLOY",
      description:
        "【Deploy】 Deploy 1 [Fatum-00]((Triple Ship Alliance)･AP2･HP2･<Blocker>) Unit token.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "Deploy 1 [Fatum-00]((Triple Ship Alliance)･AP2･HP2･<Blocker>) Unit token.",
      },
    },
    {
      trigger: "ON_ATTACK",
      description:
        "【Attack】 Choose 1 of your (Triple Ship Alliance) Unit tokens. It may attack on the turn it is deployed.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "Choose 1 of your (Triple Ship Alliance) Unit tokens. It may attack on the turn it is deployed.",
      },
    },
  ],
};
