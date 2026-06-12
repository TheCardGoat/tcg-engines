import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GundamSandrockCustom025: UnitCard = {
  cardNumber: "GD03-025",
  name: "Gundam Sandrock Custom",
  type: "unit",
  color: "green",
  traits: ["g team"],
  id: "GD03-025",
  externalId: "gundam:gd03-025",
  slug: "gundam-sandrock-custom-gd03-025",
  displayName: "Gundam Sandrock Custom",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-025",
  printings: [
    {
      id: "GD03-025",
      collectorNumber: "GD03-025",
      cardNumber: "GD03-025",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-025.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-025.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-025",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-025.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-025.webp?260424",
  legality: "legal",
  level: 6,
  cost: 5,
  ap: 5,
  hp: 4,
  linkCondition: "[Quatre Raberba Winner]",
  effect:
    "Enemy Units choose one of your rested (Maganac Corps) Units as their attack target if possible when attacking.",
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "forceAttackTarget",
            unit: { owner: "opponent", cardType: "unit", count: "all" },
            attackTarget: {
              owner: "friendly",
              cardType: "unit",
              state: "rested",
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "maganac corps" },
              ],
            },
            duration: "permanent",
          },
        },
      ],
      sourceText:
        "Enemy Units choose one of your rested (Maganac Corps) Units as their attack target if possible when attacking.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
