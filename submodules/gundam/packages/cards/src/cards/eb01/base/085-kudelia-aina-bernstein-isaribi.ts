import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const eb01KudeliaAinaBernsteinIsaribi085: BaseCard = {
  cardNumber: "EB01-085",
  name: "Kudelia Aina Bernstein & Isaribi",
  type: "base",
  color: "blue",
  traits: ["g generation", "warship"],
  id: "EB01-085",
  canonicalId: "EB01-085",
  externalIds: { bandai: "gundam:eb01-085" },
  slug: "kudelia-aina-bernstein-isaribi-eb01-085",
  displayName: "Kudelia Aina Bernstein & Isaribi",
  rulesText:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, you may choose 1 active friendly blue (G Generation) Unit and 1 enemy Unit. Rest them.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-085",
  printings: [
    {
      id: "EB01-085",
      artId: "EB01-085",
      setCode: "EB01",
      collectorNumber: "EB01-085",
      cardNumber: "EB01-085",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-085.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-085",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-085.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 5,
  cost: 1,
  hp: 5,
  battlefieldZones: ["space"],
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, you may choose 1 active friendly blue (G Generation) Unit and 1 enemy Unit. Rest them.",
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
        {
          action: {
            action: "rest",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "color",
                  comparison: "eq",
                  value: "blue",
                },
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "g generation",
                },
              ],
              count: 1,
            },
          },
          optional: true,
        },
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
          sharesTargetChoiceWithPrevious: true,
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, you may choose 1 active friendly blue (G Generation) Unit and 1 enemy Unit. Rest them.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
