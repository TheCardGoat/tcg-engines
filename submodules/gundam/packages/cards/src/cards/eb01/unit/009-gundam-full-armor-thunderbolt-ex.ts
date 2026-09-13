import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01GundamFullArmorThunderboltEx009: UnitCard = {
  cardNumber: "EB01-009",
  name: "Gundam Full Armor (Thunderbolt) (EX)",
  type: "unit",
  color: "blue",
  traits: ["g generation"],
  id: "EB01-009",
  canonicalId: "EB01-009",
  externalIds: { bandai: "gundam:eb01-009" },
  slug: "gundam-full-armor-thunderbolt-ex-eb01-009",
  displayName: "Gundam Full Armor (Thunderbolt) (EX)",
  rulesText: "【Deploy】All enemy players each choose 1 of their active Units. Rest them.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-009",
  printings: [
    {
      id: "EB01-009",
      artId: "EB01-009",
      setCode: "EB01",
      collectorNumber: "EB01-009",
      cardNumber: "EB01-009",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-009.webp",
      productName: "Eternal Nexus [EB01]",
    },
    {
      id: "EB01-009-p1",
      artId: "EB01-009_p1",
      setCode: "EB01",
      collectorNumber: "EB01-009-p1",
      cardNumber: "EB01-009",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-009_p1.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-009",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-009.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "[Io Fleming]",
  battlefieldZones: ["space", "earth"],
  effect: "【Deploy】All enemy players each choose 1 of their active Units. Rest them.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "queueEffectForPlayers",
            scope: "opponents",
            effect: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  action: {
                    action: "rest",
                    target: {
                      owner: "friendly",
                      cardType: "unit",
                      state: "active",
                      count: 1,
                    },
                  },
                },
              ],
              sourceText: "Choose 1 of your active Units. Rest it.",
            },
          },
        },
      ],
      sourceText: "【Deploy】All enemy players each choose 1 of their active Units. Rest them.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
