import type { UnitCardDefinition } from "@tcg/gundam-types";

export const JusticeGundam: UnitCardDefinition = {
  ap: 5,
  cardNumber: "GD01-066",
  cardType: "UNIT",
  color: "white",
  cost: 5,
  hp: 5,
  id: "gd01-066",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-066.webp?26013001",
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  level: 7,
  linkRequirements: ["athrun-zala"],
  name: "Justice Gundam",
  rarity: "legendary",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "【Deploy】Deploy 1 [Fatum-00]((Triple Ship Alliance)･AP2･HP2･<Blocker>) Unit token.\n【During Pair】【Attack】Choose 1 of your (Triple Ship Alliance) Unit tokens. It may attack on the turn it is deployed.",
  traits: ["triple", "ship", "alliance"],
  zones: ["space", "earth"],
};
