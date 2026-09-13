import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01PrototypeAsshimarTr3Kehaar015: UnitCard = {
  cardNumber: "EB01-015",
  name: 'Prototype Asshimar TR-3 "Kehaar"',
  type: "unit",
  color: "blue",
  traits: ["g generation"],
  id: "EB01-015",
  canonicalId: "EB01-015",
  externalIds: { bandai: "gundam:eb01-015" },
  slug: "prototype-asshimar-tr-3-kehaar-eb01-015",
  displayName: 'Prototype Asshimar TR-3 "Kehaar"',
  rulesText:
    "【Destroyed】If there are 2 or more other rested Units in play, choose 1 rested enemy Unit. Deal 1 damage to it.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-015",
  printings: [
    {
      id: "EB01-015",
      artId: "EB01-015",
      setCode: "EB01",
      collectorNumber: "EB01-015",
      cardNumber: "EB01-015",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-015.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-015",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-015.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 2,
  ap: 1,
  hp: 4,
  battlefieldZones: ["space"],
  effect:
    "【Destroyed】If there are 2 or more other rested Units in play, choose 1 rested enemy Unit. Deal 1 damage to it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
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
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "rested",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Destroyed】If there are 2 or more other rested Units in play, choose 1 rested enemy Unit. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
