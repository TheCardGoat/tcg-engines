import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd05QuessParaya094: PilotCard = {
  cardNumber: "GD05-094",
  name: "Quess Paraya",
  type: "pilot",
  color: "purple",
  traits: ["neo zeon", "newtype"],
  id: "GD05-094",
  canonicalId: "GD05-094",
  externalIds: { bandai: "gundam:gd05-094" },
  slug: "quess-paraya-gd05-094",
  displayName: "Quess Paraya",
  rulesText:
    "【Burst】Add this card to your hand.\n【Destroyed】Choose 1 of your (Neo Zeon) Units. During this turn, when it receives enemy battle damage, reduce it by 2.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-094",
  printings: [
    {
      id: "GD05-094",
      artId: "GD05-094",
      setCode: "GD05",
      collectorNumber: "GD05-094",
      cardNumber: "GD05-094",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-094.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-094",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-094.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【Destroyed】Choose 1 of your (Neo Zeon) Units. During this turn, when it receives enemy battle damage, reduce it by 2.",
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
      type: "triggered",
      activation: {
        timing: ["destroyed"],
      },
      directives: [
        {
          action: {
            action: "reduceNextDamage",
            amount: 2,
            damageType: "battle",
            duration: "thisTurn",
            consuming: false,
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "neo zeon",
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Destroyed】Choose 1 of your (Neo Zeon) Units. During this turn, when it receives enemy battle damage, reduce it by 2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
