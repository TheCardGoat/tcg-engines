import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03AudaSMaganac028: UnitCard = {
  cardNumber: "GD03-028",
  name: "Auda's Maganac",
  type: "unit",
  color: "green",
  traits: ["maganac corps"],
  id: "GD03-028",
  externalId: "gundam:gd03-028",
  slug: "auda-s-maganac-gd03-028",
  displayName: "Auda's Maganac",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-028",
  printings: [
    {
      id: "GD03-028",
      collectorNumber: "GD03-028",
      cardNumber: "GD03-028",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-028.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-028.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-028",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-028.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-028.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 3,
  linkCondition: "(Maganac Corps) Trait",
  effect: "【Attack】If you are attacking an enemy Unit, this Unit gets AP+2 during this battle.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          {
            type: "isAttackingUnit",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisBattle",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【Attack】If you are attacking an enemy Unit, this Unit gets AP+2 during this battle.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
