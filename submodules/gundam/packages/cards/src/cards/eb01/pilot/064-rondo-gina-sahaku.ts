import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const eb01RondoGinaSahaku064: PilotCard = {
  cardNumber: "EB01-064",
  name: "Rondo Gina Sahaku",
  type: "pilot",
  color: "blue",
  traits: ["g generation", "attack"],
  id: "EB01-064",
  canonicalId: "EB01-064",
  externalIds: { bandai: "gundam:eb01-064" },
  slug: "rondo-gina-sahaku-eb01-064",
  displayName: "Rondo Gina Sahaku",
  rulesText:
    "【Burst】Add this card to your hand.\nWhile this Unit has <Repair>, it gains <Breach 1>.\n\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-064",
  printings: [
    {
      id: "EB01-064",
      artId: "EB01-064",
      setCode: "EB01",
      collectorNumber: "EB01-064",
      cardNumber: "EB01-064",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-064.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-064",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-064.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\nWhile this Unit has <Repair>, it gains <Breach 1>.\n\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
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
            type: "selfHasKeyword",
            keyword: "Repair",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 1,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While this Unit has <Repair>, it gains <Breach 1>. (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
