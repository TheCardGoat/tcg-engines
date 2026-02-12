import type { UnitCardDefinition } from "@tcg/gundam-types";

export const RickDom: UnitCardDefinition = {
  ap: 3,
  cardNumber: "GD01-030",
  cardType: "UNIT",
  color: "green",
  cost: 2,
  hp: 3,
  id: "gd01-030",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-030.webp?26013001",
  keywords: [
    {
      keyword: "Breach",
      value: 2,
    },
  ],
  level: 3,
  linkRequirements: ["-"],
  name: "Rick Dom",
  rarity: "uncommon",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam",
  text: "<Breach 2> (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
  traits: ["zeon"],
  zones: ["space"],
};
