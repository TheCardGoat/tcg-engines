import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05GundamDeathscytheHellEw078: UnitCard = {
  cardNumber: "GD05-078",
  name: "Gundam Deathscythe Hell (EW)",
  type: "unit",
  color: "white",
  traits: ["g team"],
  id: "GD05-078",
  canonicalId: "GD05-078",
  externalIds: { bandai: "gundam:gd05-078" },
  slug: "gundam-deathscythe-hell-ew-gd05-078",
  displayName: "Gundam Deathscythe Hell (EW)",
  rulesText:
    "On the turn this Unit is deployed, it may choose a rested enemy Unit as its attack target and attack it.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-078",
  printings: [
    {
      id: "GD05-078",
      artId: "GD05-078",
      setCode: "GD05",
      collectorNumber: "GD05-078",
      cardNumber: "GD05-078",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-078.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-078",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-078.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam Wing: Endless Waltz",
  level: 5,
  cost: 4,
  ap: 5,
  hp: 2,
  linkCondition: "[Duo Maxwell]",
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
