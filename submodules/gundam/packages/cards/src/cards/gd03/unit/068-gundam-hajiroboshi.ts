import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GundamHajiroboshi068: UnitCard = {
  cardNumber: "GD03-068",
  name: "Gundam Hajiroboshi",
  type: "unit",
  color: "purple",
  traits: ["civilian", "gundam frame"],
  id: "GD03-068",
  externalId: "gundam:gd03-068",
  slug: "gundam-hajiroboshi-gd03-068",
  displayName: "Gundam Hajiroboshi",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-068",
  printings: [
    {
      id: "GD03-068",
      collectorNumber: "GD03-068",
      cardNumber: "GD03-068",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-068.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-068.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-068",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-068.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-068.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 3,
  linkCondition: "[Wistario Afam]",
  effect:
    "While a friendly Base is in play, this Unit gains <Blocker>.\n\r\n(Rest this Unit to change the attack target to it.)",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "friendlyBaseInPlay",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Blocker",
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While a friendly Base is in play, this Unit gains <Blocker>. (Rest this Unit to change the attack target to it.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
