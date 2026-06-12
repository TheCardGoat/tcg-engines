import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03KshatriyaBesserung005: UnitCard = {
  cardNumber: "GD03-005",
  name: "Kshatriya Besserung",
  type: "unit",
  color: "blue",
  traits: ["neo zeon"],
  id: "GD03-005",
  externalId: "gundam:gd03-005",
  slug: "kshatriya-besserung-gd03-005",
  displayName: "Kshatriya Besserung",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-005",
  printings: [
    {
      id: "GD03-005",
      collectorNumber: "GD03-005",
      cardNumber: "GD03-005",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-005.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-005.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-005",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-005.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-005.webp?260424",
  legality: "legal",
  level: 6,
  cost: 5,
  ap: 4,
  hp: 4,
  linkCondition: "[Marida Cruz]",
  effect:
    "<Repair 1> (At the end of your turn, this Unit recovers the specified number of HP.)\n【Deploy】Draw 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
      ],
      sourceText: "【Deploy】Draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Repair", value: 1 }],
  rarity: "rare",
};
