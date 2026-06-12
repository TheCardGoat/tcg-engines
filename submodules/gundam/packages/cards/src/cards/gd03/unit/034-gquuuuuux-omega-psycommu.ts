import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GquuuuuuxOmegaPsycommu034: UnitCard = {
  cardNumber: "GD03-034",
  name: "GQuuuuuuX (Omega Psycommu)",
  type: "unit",
  color: "red",
  traits: ["clan"],
  id: "GD03-034",
  externalId: "gundam:gd03-034",
  slug: "gquuuuuux-omega-psycommu-gd03-034",
  displayName: "GQuuuuuuX (Omega Psycommu)",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-034",
  printings: [
    {
      id: "GD03-034",
      collectorNumber: "GD03-034",
      cardNumber: "GD03-034",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-034.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-034.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-034_p1",
      collectorNumber: "GD03-034_p1",
      cardNumber: "GD03-034",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-034_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-034_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-034_p2",
      collectorNumber: "GD03-034_p2",
      cardNumber: "GD03-034",
      set: {
        code: "GD03",
        name: "WORLD CHAMPIONSHIPS 26-27 Season 1Winner Prize",
        packageId: "616901",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-034_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-034_p2.webp?260424",
      productName: "WORLD CHAMPIONSHIPS 26-27 Season 1Winner Prize",
    },
  ],
  selectedPrintingId: "GD03-034",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-034.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-034.webp?260424",
  legality: "legal",
  level: 8,
  cost: 7,
  ap: 6,
  hp: 5,
  linkCondition: "[Amate Yuzuriha (Machu)] / [Nyaan]",
  effect:
    "<Suppression> (Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)\n【Deploy】Choose 1 enemy Unit. Deal 3 damage to it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 3,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Deploy】Choose 1 enemy Unit. Deal 3 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Suppression" }],
  rarity: "legendRare",
};
