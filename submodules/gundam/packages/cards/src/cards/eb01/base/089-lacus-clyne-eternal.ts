import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const eb01LacusClyneEternal089: BaseCard = {
  cardNumber: "EB01-089",
  name: "Lacus Clyne & Eternal",
  type: "base",
  color: "white",
  traits: ["g generation", "warship"],
  id: "EB01-089",
  canonicalId: "EB01-089",
  externalIds: { bandai: "gundam:eb01-089" },
  slug: "lacus-clyne-eternal-eb01-089",
  displayName: "Lacus Clyne & Eternal",
  rulesText:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, choose 1 rested friendly white (G Generation) Unit. Set it as active. It can't attack during this turn.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-089",
  printings: [
    {
      id: "EB01-089",
      artId: "EB01-089",
      setCode: "EB01",
      collectorNumber: "EB01-089",
      cardNumber: "EB01-089",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-089.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-089",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-089.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 2,
  hp: 5,
  battlefieldZones: ["space"],
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, choose 1 rested friendly white (G Generation) Unit. Set it as active. It can't attack during this turn.",
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
            action: "setActive",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "rested",
              attributeFilters: [
                {
                  attribute: "color",
                  comparison: "eq",
                  value: "white",
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
        },
        {
          action: {
            action: "cantAttack",
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "color",
                  comparison: "eq",
                  value: "white",
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
          dependsOnPrevious: true,
          sharesTargetChoiceWithPrevious: true,
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, choose 1 rested friendly white (G Generation) Unit. Set it as active. It can't attack during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
