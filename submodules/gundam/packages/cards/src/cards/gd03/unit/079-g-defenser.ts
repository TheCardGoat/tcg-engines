import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GDefenser079: UnitCard = {
  cardNumber: "GD03-079",
  name: "G-Defenser",
  type: "unit",
  color: "white",
  traits: ["aeug"],
  id: "GD03-079",
  externalId: "gundam:gd03-079",
  slug: "g-defenser-gd03-079",
  displayName: "G-Defenser",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-079",
  printings: [
    {
      id: "GD03-079",
      collectorNumber: "GD03-079",
      cardNumber: "GD03-079",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-079.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-079.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-079",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-079.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-079.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 2,
  linkCondition: "(AEUG) Trait",
  effect:
    "When you rest your Base with one of your Units' effects, you may rest this Unit instead.",
  effects: [
    {
      type: "substitution",
      activation: {},
      directives: [
        {
          action: {
            action: "unparsedText",
            text: "When you rest your Base with one of your Units' effects, you may rest this Unit instead.",
          },
        },
      ],
      sourceText:
        "When you rest your Base with one of your Units' effects, you may rest this Unit instead.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
