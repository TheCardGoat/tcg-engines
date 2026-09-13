import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const eb01CharacterRequests073: CommandCard = {
  cardNumber: "EB01-073",
  name: "Character Requests",
  type: "command",
  color: "blue",
  traits: [],
  id: "EB01-073",
  canonicalId: "EB01-073",
  externalIds: { bandai: "gundam:eb01-073" },
  slug: "character-requests-eb01-073",
  displayName: "Character Requests",
  rulesText: "【Burst】Draw 1.\n【Main】If there are 6 or more rested Units in play, draw 2.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-073",
  printings: [
    {
      id: "EB01-073",
      artId: "EB01-073",
      setCode: "EB01",
      collectorNumber: "EB01-073",
      cardNumber: "EB01-073",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-073.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-073",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-073.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 6,
  cost: 2,
  effect: "【Burst】Draw 1.\n【Main】If there are 6 or more rested Units in play, draw 2.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
      ],
      sourceText: "【Burst】Draw 1.",
    },
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "any",
            comparison: "gte",
            count: 6,
            state: "rested",
          },
          thenDirectives: [{ action: { action: "draw", count: 2 } }],
        },
      ],
      sourceText: "【Main】If there are 6 or more rested Units in play, draw 2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
