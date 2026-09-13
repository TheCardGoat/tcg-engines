import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd05PresidentialOffice130: BaseCard = {
  cardNumber: "GD05-130",
  name: "Presidential Office",
  type: "base",
  color: "white",
  traits: ["earth sphere unified nation", "stronghold"],
  id: "GD05-130",
  canonicalId: "GD05-130",
  externalIds: { bandai: "gundam:gd05-130" },
  slug: "presidential-office-gd05-130",
  displayName: "Presidential Office",
  rulesText:
    '【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Destroyed】You may exile this card in your trash from the game. If you do, you may deploy 1 Base card with "Presidential Office" in its card name from your hand.',
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-130",
  printings: [
    {
      id: "GD05-130",
      artId: "GD05-130",
      setCode: "GD05",
      collectorNumber: "GD05-130",
      cardNumber: "GD05-130",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-130.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-130",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-130.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam Wing: Endless Waltz",
  level: 2,
  cost: 1,
  hp: 5,
  battlefieldZones: ["earth"],
  effect:
    '【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Destroyed】You may exile this card in your trash from the game. If you do, you may deploy 1 Base card with "Presidential Office" in its card name from your hand.',
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "deploySelf",
          },
        },
      ],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "addShieldToHand",
            count: 1,
          },
        },
      ],
      sourceText: "【Deploy】Add 1 of your Shields to your hand.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
      },
      directives: [
        {
          action: {
            action: "exileSelf",
          },
          optional: true,
        },
        {
          action: {
            action: "deploy",
            target: {
              owner: "friendly",
              cardType: "base",
              zone: "hand",
              count: 1,
              attributeFilters: [
                { attribute: "name", comparison: "includes", value: "Presidential Office" },
              ],
            },
          },
          optional: true,
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        '【Destroyed】You may exile this card in your trash from the game. If you do, you may deploy 1 Base card with "Presidential Office" in its card name from your hand.',
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
