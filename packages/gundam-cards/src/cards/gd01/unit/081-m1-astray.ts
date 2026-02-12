import type { UnitCardDefinition } from "@tcg/gundam-types";

export const M1Astray: UnitCardDefinition = {
  ap: 2,
  cardNumber: "GD01-081",
  cardType: "UNIT",
  color: "white",
  cost: 2,
  hp: 2,
  id: "gd01-081",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-081.webp?26013001",
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  level: 2,
  linkRequirements: ["-"],
  name: "M1 Astray",
  rarity: "common",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "While you have another (Triple Ship Alliance) Unit in play, this Unit gets AP+1 and <Blocker>.\n\n (Rest this Unit to change the attack target to it.)",
  traits: ["triple", "ship", "alliance"],
  zones: ["space", "earth"],
};
