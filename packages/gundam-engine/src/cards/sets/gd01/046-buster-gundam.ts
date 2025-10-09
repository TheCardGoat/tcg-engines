import type { UnitCardDefinition } from "../../card-types";

export const BusterGundam: UnitCardDefinition = {
  id: "gd01-046",
  name: "Buster Gundam",
  cardNumber: "GD01-046",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "legendary",
  color: "red",
  level: 4,
  cost: 2,
  text: "【Activate･Main】<Support 3> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)\n【During Pair･(Coordinator) Pilot】【Once per Turn】When you use this Unit&#039;s <Support> to increase a (ZAFT) Unit&#039;s AP, set this Unit as active.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-046.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 1,
  hp: 4,
  zones: ["space", "earth"],
  traits: ["zaft"],
  linkRequirements: ["dearka-elthman"],
  keywords: [
    {
      keyword: "Support",
      value: 3,
    },
    {
      keyword: "Support",
    },
  ],
  abilities: [
    {
      activated: {
        timing: "MAIN",
      },
      description:
        "【Activate･Main】 <Support 3> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.) 【During Pair･(Coordinator) Pilot】【Once per Turn】When you use this Unit&#039;s <Support> to increase a (ZAFT) Unit&#039;s AP, set this Unit as active.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "<Support 3> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.) 【During Pair･(Coordinator) Pilot】【Once per Turn】When you use this Unit&#039;s <Support> to increase a (ZAFT) Unit&#039;s AP, set this Unit as active.",
      },
    },
  ],
};
