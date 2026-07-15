import type { UnitCardDefinition } from "@tcg/gundam-types";

export const BigZam: UnitCardDefinition = {
  ap: 5,
  cardNumber: "GD01-027",
  cardType: "UNIT",
  color: "green",
  cost: 5,
  hp: 6,
  id: "gd01-027",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-027.webp?26013001",
  keywords: [
    {
      keyword: "Breach",
      value: 4,
    },
    {
      keyword: "Blocker",
    },
  ],
  level: 7,
  linkRequirements: ["dozle-zabi"],
  name: "Big Zam",
  rarity: "rare",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam",
  text: "<Breach 4> (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)\n【Deploy】If there are 10 or more (Zeon)/(Neo Zeon) Unit cards in your trash, deal 4 damage to all Units with <Blocker>.",
  traits: ["zeon"],
  zones: ["space", "earth"],
};
