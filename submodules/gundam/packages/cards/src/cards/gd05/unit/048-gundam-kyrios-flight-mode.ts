import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05GundamKyriosFlightMode048: UnitCard = {
  cardNumber: "GD05-048",
  name: "Gundam Kyrios (Flight Mode)",
  type: "unit",
  color: "red",
  traits: ["cb", "gn drive"],
  id: "GD05-048",
  canonicalId: "GD05-048",
  externalIds: { bandai: "gundam:gd05-048" },
  slug: "gundam-kyrios-flight-mode-gd05-048",
  displayName: "Gundam Kyrios (Flight Mode)",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-048",
  printings: [
    {
      id: "GD05-048",
      artId: "GD05-048",
      setCode: "GD05",
      collectorNumber: "GD05-048",
      cardNumber: "GD05-048",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-048.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-048.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-048_p1",
      artId: "GD05-048_p1",
      setCode: "GD05",
      collectorNumber: "GD05-048_p1",
      cardNumber: "GD05-048",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-048_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-048_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-048", "GD05-048_p1"],
  selectedPrintingId: "GD05-048",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-048.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-048.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam 00",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 1,
  linkCondition: "[Allelujah Haptism] / [Hallelujah Haptism]",
  battlefieldZones: ["space", "earth"],
  effect:
    "On the turn this Unit is deployed, it may choose a rested enemy Unit as its attack target and attack it.",
  effects: [
    {
      type: "triggered",
      activation: { timing: ["deploy"] },
      directives: [
        {
          action: {
            action: "allowAttackDeployedThisTurn",
            duration: "thisTurn",
            target: {
              owner: "self",
              cardType: "unit",
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "rested",
            },
          },
        },
      ],
      sourceText:
        "On the turn this Unit is deployed, it may choose a rested enemy Unit as its attack target and attack it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
