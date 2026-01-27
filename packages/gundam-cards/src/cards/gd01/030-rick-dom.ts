import type { UnitCardDefinition } from "@tcg/gundam-types";

export const RickDom: UnitCardDefinition = {
  id: "gd01-030",
  name: "Rick Dom",
  cardNumber: "GD01-030",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "green",
  level: 3,
  cost: 2,
  text: "<Breach 2> (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-030.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 3,
  hp: 3,
  zones: ["space"],
  traits: ["zeon"],
  linkRequirements: ["-"],
  keywords: [
    {
      keyword: "Breach",
      value: 2,
    },
  ],
  abilities: [
    {
      description:
        "<Breach 2> (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
      effect: {
        type: "UNKNOWN",
        rawText:
          "<Breach 2> (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
      },
    },
  ],
};
