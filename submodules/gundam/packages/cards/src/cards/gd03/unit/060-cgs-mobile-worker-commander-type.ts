import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03CgsMobileWorkerCommanderType060: UnitCard = {
  cardNumber: "GD03-060",
  name: "CGS Mobile Worker (Commander Type)",
  type: "unit",
  color: "purple",
  traits: ["tekkadan"],
  id: "GD03-060",
  externalId: "gundam:gd03-060",
  slug: "cgs-mobile-worker-commander-type-gd03-060",
  displayName: "CGS Mobile Worker (Commander Type)",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-060",
  printings: [
    {
      id: "GD03-060",
      collectorNumber: "GD03-060",
      cardNumber: "GD03-060",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-060.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-060.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-060_p1",
      collectorNumber: "GD03-060_p1",
      cardNumber: "GD03-060",
      set: {
        code: "PC01A",
        name: "Premium Card Collection GUNDAM ASSEMBLE Set -Mobile Suit Gundam IRON-BLOODED ORPHANS-[PC01A]",
        packageId: "616701",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-060_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-060_p1.webp?260424",
      productName:
        "Premium Card Collection GUNDAM ASSEMBLE Set -Mobile Suit Gundam IRON-BLOODED ORPHANS-[PC01A]",
    },
  ],
  selectedPrintingId: "GD03-060",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-060.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-060.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 0,
  hp: 2,
  effect:
    "【Once per Turn】During your turn, when this Unit receives effect damage, deploy 1 rested [CGS Mobile Worker]((Tekkadan)･AP1･HP1) Unit token.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onEffectDamageReceived"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
        conditions: [{ type: "isTurn", whose: "friendly" }, { type: "eventCardIsSelf" }],
      },
      directives: [
        {
          action: {
            action: "deployToken",
            token: {
              name: "CGS Mobile Worker",
              traits: ["tekkadan"],
              ap: 1,
              hp: 1,
              deployState: "rested",
            },
          },
        },
      ],
      sourceText:
        "【Once per Turn】During your turn, when this Unit receives effect damage, deploy 1 rested [CGS Mobile Worker]((Tekkadan)·AP1·HP1) Unit token.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
export const pc01aCgsMobileWorkerCommanderType060 = gd03CgsMobileWorkerCommanderType060;
