import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03JusticeGundamMeteor077: UnitCard = {
  cardNumber: "GD03-077",
  name: "Justice Gundam (METEOR)",
  type: "unit",
  color: "white",
  traits: ["triple ship alliance"],
  id: "GD03-077",
  externalId: "gundam:gd03-077",
  slug: "justice-gundam-meteor-gd03-077",
  displayName: "Justice Gundam (METEOR)",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-077",
  printings: [
    {
      id: "GD03-077",
      collectorNumber: "GD03-077",
      cardNumber: "GD03-077",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-077.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-077.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-077",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-077.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-077.webp?260424",
  legality: "legal",
  level: 8,
  cost: 7,
  ap: 6,
  hp: 6,
  linkCondition: "[Athrun Zala]",
  effect:
    "【When Linked】Choose 1 to 3 enemy Units with 3 or less HP. Return them to their owners' hands.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [{ attribute: "hp", comparison: "lte", value: 3 }],
              count: { min: 1, max: 3 },
            },
          },
        },
      ],
      sourceText:
        "【When Linked】Choose 1 to 3 enemy Units with 3 or less HP. Return them to their owners' hands.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
