import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03Gfred048: UnitCard = {
  cardNumber: "GD03-048",
  name: "GFreD",
  type: "unit",
  color: "red",
  traits: ["zeon"],
  id: "GD03-048",
  externalId: "gundam:gd03-048",
  slug: "gfred-gd03-048",
  displayName: "GFreD",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-048",
  printings: [
    {
      id: "GD03-048",
      collectorNumber: "GD03-048",
      cardNumber: "GD03-048",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-048.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-048.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-048_p1",
      collectorNumber: "GD03-048_p1",
      cardNumber: "GD03-048",
      set: {
        code: "PC02A",
        name: "Premium Card Collection GUNDAM ASSEMBLE Set -Mobile Suit Gundam GQuuuuuuX-[PC02A]",
        packageId: "616701",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-048_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-048_p1.webp?260424",
      productName:
        "Premium Card Collection GUNDAM ASSEMBLE Set -Mobile Suit Gundam GQuuuuuuX-[PC02A]",
    },
  ],
  selectedPrintingId: "GD03-048",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-048.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-048.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 4,
  hp: 2,
  linkCondition: "[Nyaan]",
  effect:
    "【Burst】If there are 3 or less enemy Shields, deploy 1 rested [GFreD]((Zeon)･AP4･HP3) Unit token.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
        conditions: [
          {
            type: "cardInZone",
            owner: "opponent",
            zone: "shieldArea",
            comparison: "lte",
            count: 3,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "deployToken",
            token: {
              name: "GFreD",
              traits: ["zeon"],
              ap: 4,
              hp: 3,
              deployState: "rested",
            },
          },
        },
      ],
      sourceText:
        "【Burst】If there are 3 or less enemy Shields, deploy 1 rested [GFreD]((Zeon)·AP4·HP3) Unit token.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
export const pc02aGfred048 = gd03Gfred048;
