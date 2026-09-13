import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const eb01IoFleming063: PilotCard = {
  cardNumber: "EB01-063",
  name: "Io Fleming",
  type: "pilot",
  color: "blue",
  traits: ["g generation", "durability"],
  id: "EB01-063",
  canonicalId: "EB01-063",
  externalIds: { bandai: "gundam:eb01-063" },
  slug: "io-fleming-eb01-063",
  displayName: "Io Fleming",
  rulesText:
    "【Burst】Add this card to your hand.\nIf there are 2 or more other rested Units in play, this Unit gains <Repair 2>.\n\n(At the end of your turn, this Unit recovers the specified number of HP.)",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-063",
  printings: [
    {
      id: "EB01-063",
      artId: "EB01-063",
      setCode: "EB01",
      collectorNumber: "EB01-063",
      cardNumber: "EB01-063",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-063.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-063",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-063.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\nIf there are 2 or more other rested Units in play, this Unit gains <Repair 2>.\n\n(At the end of your turn, this Unit recovers the specified number of HP.)",
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
        conditions: [
          {
            type: "unitCount",
            owner: "any",
            comparison: "gte",
            count: 2,
            state: "rested",
            excludeSelf: true,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Repair",
            keywordValue: 2,
            duration: "permanent",
            target: { owner: "self", cardType: "unit" },
          },
        },
      ],
      sourceText:
        "If there are 2 or more other rested Units in play, this Unit gains <Repair 2>. (At the end of your turn, this Unit recovers the specified number of HP.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
