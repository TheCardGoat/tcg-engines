import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GundamBarbatos6thForm061: UnitCard = {
  cardNumber: "GD03-061",
  name: "Gundam Barbatos 6th Form",
  type: "unit",
  color: "purple",
  traits: ["tekkadan", "gundam frame"],
  id: "GD03-061",
  externalId: "gundam:gd03-061",
  slug: "gundam-barbatos-6th-form-gd03-061",
  displayName: "Gundam Barbatos 6th Form",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-061",
  printings: [
    {
      id: "GD03-061",
      collectorNumber: "GD03-061",
      cardNumber: "GD03-061",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-061.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-061.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-061",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-061.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-061.webp?260424",
  legality: "legal",
  level: 6,
  cost: 5,
  ap: 5,
  hp: 4,
  linkCondition: "[Mikazuki Augus]",
  effect:
    "While this Unit has 1 HP, it gains <Repair 3>.\n\r\n(At the end of your turn, this Unit recovers the specified number of HP.)",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "selfStat",
            stat: "hp",
            comparison: "eq",
            value: 1,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Repair",
            keywordValue: 3,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While this Unit has 1 HP, it gains <Repair 3>. (At the end of your turn, this Unit recovers the specified number of HP.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
