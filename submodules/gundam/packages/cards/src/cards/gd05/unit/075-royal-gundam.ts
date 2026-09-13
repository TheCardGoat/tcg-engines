import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05RoyalGundam075: UnitCard = {
  cardNumber: "GD05-075",
  name: "Royal Gundam",
  type: "unit",
  color: "white",
  traits: ["mf"],
  id: "GD05-075",
  canonicalId: "GD05-075",
  externalIds: { bandai: "gundam:gd05-075" },
  slug: "royal-gundam-gd05-075",
  displayName: "Royal Gundam",
  rulesText:
    "<Blocker> (Rest this Unit to change the attack target to it.)\nThis Unit can't choose the enemy player as its attack target.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-075",
  printings: [
    {
      id: "GD05-075",
      artId: "GD05-075",
      setCode: "GD05",
      collectorNumber: "GD05-075",
      cardNumber: "GD05-075",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-075.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-075",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-075.webp",
  legality: "legal",
  sourceTitle: "Mobile Fighter G Gundam",
  level: 2,
  cost: 2,
  ap: 3,
  hp: 2,
  battlefieldZones: ["space", "earth"],
  effect:
    "<Blocker> (Rest this Unit to change the attack target to it.)\nThis Unit can't choose the enemy player as its attack target.",
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "cantTargetPlayer",
            whose: "opponent",
          },
        },
      ],
      sourceText: "This Unit can't choose the enemy player as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "common",
};
