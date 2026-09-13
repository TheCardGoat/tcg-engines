import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd05NewtypeLabsDirector115: CommandCard = {
  cardNumber: "GD05-115",
  name: "Newtype Labs Director",
  type: "command",
  color: "purple",
  traits: [],
  id: "GD05-115",
  canonicalId: "GD05-115",
  externalIds: { bandai: "gundam:gd05-115" },
  slug: "newtype-labs-director-gd05-115",
  displayName: "Newtype Labs Director",
  rulesText:
    "【Burst】Draw 1.\n【Main】Choose 1 (Neo Zeon) Pilot card from your trash. Add it to your hand.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-115",
  printings: [
    {
      id: "GD05-115",
      artId: "GD05-115",
      setCode: "GD05",
      collectorNumber: "GD05-115",
      cardNumber: "GD05-115",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-115.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-115",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-115.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 6,
  cost: 2,
  effect:
    "【Burst】Draw 1.\n【Main】Choose 1 (Neo Zeon) Pilot card from your trash. Add it to your hand.",
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
          action: {
            action: "addFromTrash",
            target: {
              owner: "friendly",
              cardType: "pilot",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "neo zeon",
                },
              ],
              zone: "trash",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Main】Choose 1 (Neo Zeon) Pilot card from your trash. Add it to your hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
