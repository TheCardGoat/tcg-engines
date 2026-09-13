import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05Michaelis030: UnitCard = {
  cardNumber: "GD05-030",
  name: "Michaelis",
  type: "unit",
  color: "green",
  traits: ["academy"],
  id: "GD05-030",
  canonicalId: "GD05-030",
  externalIds: { bandai: "gundam:gd05-030" },
  slug: "michaelis-gd05-030",
  displayName: "Michaelis",
  rulesText:
    "On the turn this Unit is deployed, it may choose a rested enemy Unit as its attack target and attack it.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-030",
  printings: [
    {
      id: "GD05-030",
      artId: "GD05-030",
      setCode: "GD05",
      collectorNumber: "GD05-030",
      cardNumber: "GD05-030",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-030.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-030",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-030.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 3,
  linkCondition: "[Shaddiq Zenelli]",
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
