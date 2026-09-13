import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd05ProsperaMercury088: PilotCard = {
  cardNumber: "GD05-088",
  name: "Prospera Mercury",
  type: "pilot",
  color: "green",
  traits: ["quiet zero"],
  id: "GD05-088",
  canonicalId: "GD05-088",
  externalIds: { bandai: "gundam:gd05-088" },
  slug: "prospera-mercury-gd05-088",
  displayName: "Prospera Mercury",
  rulesText:
    '【Burst】Add this card to your hand.\nThis Unit and all your Units with "Gundam Lfrith" or "Gundnode" in their card name get AP+1.',
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-088",
  printings: [
    {
      id: "GD05-088",
      artId: "GD05-088",
      setCode: "GD05",
      collectorNumber: "GD05-088",
      cardNumber: "GD05-088",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-088.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-088",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-088.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  level: 5,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    '【Burst】Add this card to your hand.\nThis Unit and all your Units with "Gundam Lfrith" or "Gundnode" in their card name get AP+1.',
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
      activation: {},
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "permanent",
            target: { owner: "self", cardType: "unit" },
          },
        },
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "permanent",
            target: {
              owner: "friendly",
              cardType: "unit",
              excludeSource: true,
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    { attribute: "name", comparison: "includes", value: "Gundam Lfrith" },
                    { attribute: "name", comparison: "includes", value: "Gundnode" },
                  ],
                },
              ],
            },
          },
        },
      ],
      sourceText:
        'This Unit and all your Units with "Gundam Lfrith" or "Gundnode" in their card name get AP+1.',
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
