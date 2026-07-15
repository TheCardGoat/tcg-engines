import type { UnitCardDefinition } from "@tcg/gundam-types";

export const BusterGundam: UnitCardDefinition = {
  ap: 1,
  cardNumber: "GD01-046",
  cardType: "UNIT",
  color: "red",
  cost: 2,
  hp: 4,
  id: "gd01-046",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-046.webp?26013001",
  keywords: [
    {
      keyword: "Support",
      value: 3,
    },
    {
      keyword: "Support",
    },
  ],
  level: 4,
  linkRequirements: ["dearka-elthman"],
  name: "Buster Gundam",
  rarity: "legendary",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "【Activate･Main】<Support 3> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)\n【During Pair･(Coordinator) Pilot】【Once per Turn】When you use this Unit&#039;s <Support> to increase a (ZAFT) Unit&#039;s AP, set this Unit as active.",
  traits: ["zaft"],
  zones: ["space", "earth"],
};
