import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01ExtremeGundam058: UnitCard = {
  cardNumber: "EB01-058",
  name: "Extreme Gundam",
  type: "unit",
  color: "white",
  traits: ["g generation"],
  id: "EB01-058",
  canonicalId: "EB01-058",
  externalIds: { bandai: "gundam:eb01-058" },
  slug: "extreme-gundam-eb01-058",
  displayName: "Extreme Gundam",
  rulesText:
    "If there are 2 or more enemy players, this Unit gains <Blocker>.\n\n(Rest this Unit to change the attack target to it.)",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-058",
  printings: [
    {
      id: "EB01-058",
      artId: "EB01-058",
      setCode: "EB01",
      collectorNumber: "EB01-058",
      cardNumber: "EB01-058",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-058.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-058",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-058.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 2,
  ap: 3,
  hp: 4,
  battlefieldZones: ["space", "earth"],
  effect:
    "If there are 2 or more enemy players, this Unit gains <Blocker>.\n\n(Rest this Unit to change the attack target to it.)",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [{ type: "enemyPlayerCount", comparison: "gte", count: 2 }],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Blocker",
            duration: "permanent",
            target: { owner: "self", cardType: "unit" },
          },
        },
      ],
      sourceText:
        "If there are 2 or more enemy players, this Unit gains <Blocker>. (Rest this Unit to change the attack target to it.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
