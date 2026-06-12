import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01GundamHeavyarms034: UnitCard = {
  cardNumber: "GD01-034",
  name: "Gundam Heavyarms",
  type: "unit",
  color: "green",
  traits: ["operation meteor"],
  id: "GD01-034",
  externalId: "gundam:gd01-034",
  slug: "gundam-heavyarms-gd01-034",
  displayName: "Gundam Heavyarms",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-034",
  printings: [
    {
      id: "GD01-034",
      collectorNumber: "GD01-034",
      cardNumber: "GD01-034",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-034.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-034.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-034_p1",
      collectorNumber: "GD01-034_p1",
      cardNumber: "GD01-034",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-034_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-034_p1.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "GD01-034",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-034.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-034.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 3,
  hp: 4,
  effect:
    "【During Pair】This Unit gains &lt;Breach 3&gt;.<br>\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)<br>",
  effects: [
    {
      type: "constant",
      activation: { conditions: [{ type: "duringPair" }] },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 3,
            duration: "permanent",
            target: { owner: "self" },
          },
        },
      ],
      sourceText: "【During Pair】This Unit gains <Breach 3>.",
    },
  ] satisfies CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
