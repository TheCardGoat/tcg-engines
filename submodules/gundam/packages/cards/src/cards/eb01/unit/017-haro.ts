import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01Haro017: UnitCard = {
  cardNumber: "EB01-017",
  name: "Haro",
  type: "unit",
  color: "blue",
  traits: ["g generation"],
  id: "EB01-017",
  canonicalId: "EB01-017",
  externalIds: { bandai: "gundam:eb01-017" },
  slug: "haro-eb01-017",
  displayName: "Haro",
  rulesText:
    "【Destroyed】If this Unit is destroyed with battle damage, you and the player who destroyed this Unit draw 1.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-017",
  printings: [
    {
      id: "EB01-017",
      artId: "EB01-017",
      setCode: "EB01",
      collectorNumber: "EB01-017",
      cardNumber: "EB01-017",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-017.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-017",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-017.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 3,
  ap: 3,
  hp: 3,
  battlefieldZones: ["space", "earth"],
  effect:
    "【Destroyed】If this Unit is destroyed with battle damage, you and the player who destroyed this Unit draw 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
        conditions: [{ type: "eventDamageType", damageType: "battle" }],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
        {
          action: {
            action: "drawEventDestroyer",
            count: 1,
          },
        },
      ],
      sourceText:
        "【Destroyed】If this Unit is destroyed with battle damage, you and the player who destroyed this Unit draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
