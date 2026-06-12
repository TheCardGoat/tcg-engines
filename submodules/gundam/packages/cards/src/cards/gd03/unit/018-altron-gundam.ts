import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03AltronGundam018: UnitCard = {
  cardNumber: "GD03-018",
  name: "Altron Gundam",
  type: "unit",
  color: "green",
  traits: ["g team"],
  id: "GD03-018",
  externalId: "gundam:gd03-018",
  slug: "altron-gundam-gd03-018",
  displayName: "Altron Gundam",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-018",
  printings: [
    {
      id: "GD03-018",
      collectorNumber: "GD03-018",
      cardNumber: "GD03-018",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-018.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-018.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-018_p1",
      collectorNumber: "GD03-018_p1",
      cardNumber: "GD03-018",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-018_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-018_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-018",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-018.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-018.webp?260424",
  legality: "legal",
  level: 8,
  cost: 6,
  ap: 5,
  hp: 6,
  linkCondition: "[Chang Wufei]",
  effect:
    "<Breach 5> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)\n【Attack】Choose 1 enemy Unit with <Blocker>. Deal 5 damage to it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 5,
            target: {
              owner: "opponent",
              cardType: "unit",
              hasKeyword: "Blocker",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Attack】Choose 1 enemy Unit with <Blocker>. Deal 5 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Breach", value: 5 }],
  rarity: "legendRare",
};
