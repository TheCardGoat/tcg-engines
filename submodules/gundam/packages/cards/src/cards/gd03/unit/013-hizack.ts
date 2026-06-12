import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03Hizack013: UnitCard = {
  cardNumber: "GD03-013",
  name: "Hizack",
  type: "unit",
  color: "blue",
  traits: ["titans", "jupitris"],
  id: "GD03-013",
  externalId: "gundam:gd03-013",
  slug: "hizack-gd03-013",
  displayName: "Hizack",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-013",
  printings: [
    {
      id: "GD03-013",
      collectorNumber: "GD03-013",
      cardNumber: "GD03-013",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-013.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-013.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-013",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-013.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-013.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 2,
  hp: 2,
  effect:
    "While you have another (Jupitris) Unit in play, this Unit gets AP+1 and <Repair 1>.\n\r\n(At the end of your turn, this Unit recovers the specified number of HP.)",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            excludeSelf: true,
            hasTrait: "jupitris",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
        {
          action: {
            action: "grantKeyword",
            keyword: "Repair",
            keywordValue: 1,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While you have another (Jupitris) Unit in play, this Unit gets AP+1 and <Repair 1>. (At the end of your turn, this Unit recovers the specified number of HP.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
