import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd03AsemuAsuno088: PilotCard = {
  cardNumber: "GD03-088",
  name: "Asemu Asuno",
  type: "pilot",
  color: "green",
  traits: ["earth federation", "asuno family"],
  id: "GD03-088",
  externalId: "gundam:gd03-088",
  slug: "asemu-asuno-gd03-088",
  displayName: "Asemu Asuno",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-088",
  printings: [
    {
      id: "GD03-088",
      collectorNumber: "GD03-088",
      cardNumber: "GD03-088",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-088.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-088.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-088_p1",
      collectorNumber: "GD03-088_p1",
      cardNumber: "GD03-088",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-088_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-088_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-088",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-088.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-088.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【During Link】If this is an (AGE System) Unit, it gets AP+1 and <Breach 1>.\n\r\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addSelfToHand",
          },
        },
      ],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "constant",
      activation: {
        conditions: [{ type: "duringLink" }, { type: "linkedUnitHasTrait", trait: "age system" }],
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
            keyword: "Breach",
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
        "【During Link】If this is an (AGE System) Unit, it gets AP+1 and <Breach 1>. (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
