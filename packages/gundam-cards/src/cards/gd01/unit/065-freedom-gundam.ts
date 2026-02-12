import type { UnitCardDefinition } from "@tcg/gundam-types";

export const FreedomGundam: UnitCardDefinition = {
  ap: 4,
  cardNumber: "GD01-065",
  cardType: "UNIT",
  color: "white",
  cost: 5,
  hp: 6,
  id: "gd01-065",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-065.webp?26013001",
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  level: 7,
  linkRequirements: ["kira-yamato"],
  name: "Freedom Gundam",
  rarity: "legendary",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "<Blocker> (Rest this Unit to change the attack target to it.)\n【During Pair】【Once per Turn】When you pair a Pilot with this Unit or one of your white Units, choose 1 enemy Unit. It gets AP-2 during this turn.",
  traits: ["triple", "ship", "alliance"],
  zones: ["space", "earth"],
};
