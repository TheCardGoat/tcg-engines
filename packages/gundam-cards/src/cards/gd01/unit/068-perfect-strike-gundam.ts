import type { UnitCardDefinition } from "@tcg/gundam-types";

export const PerfectStrikeGundam: UnitCardDefinition = {
  ap: 4,
  cardNumber: "GD01-068",
  cardType: "UNIT",
  color: "white",
  cost: 3,
  hp: 4,
  id: "gd01-068",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-068.webp?26013001",
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  level: 5,
  linkRequirements: ["(earth-alliance)-trait"],
  name: "Perfect Strike Gundam",
  rarity: "rare",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "<Blocker> (Rest this Unit to change the attack target to it.)\n【Deploy】Choose 1 enemy Unit with 1 HP. Return it to its owner&#039;s hand.",
  traits: ["triple", "ship", "alliance"],
  zones: ["space", "earth"],
};
