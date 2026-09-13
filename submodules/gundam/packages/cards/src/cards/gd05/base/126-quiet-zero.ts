import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd05QuietZero126: BaseCard = {
  cardNumber: "GD05-126",
  name: "Quiet Zero",
  type: "base",
  color: "green",
  traits: ["quiet zero", "stronghold"],
  id: "GD05-126",
  canonicalId: "GD05-126",
  externalIds: { bandai: "gundam:gd05-126" },
  slug: "quiet-zero-gd05-126",
  displayName: "Quiet Zero",
  rulesText:
    '【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Activate･Main】【Once per Turn】②：If you have a Unit with "Gundam Aerial" in its card name that is Lv.5 or higher in play, deploy 1 [Gundnode]((Quiet Zero)･AP2･HP2･<Breach 1>) Unit token.',
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-126",
  printings: [
    {
      id: "GD05-126",
      artId: "GD05-126",
      setCode: "GD05",
      collectorNumber: "GD05-126",
      cardNumber: "GD05-126",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-126.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-126",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-126.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  level: 6,
  cost: 1,
  hp: 6,
  battlefieldZones: ["space"],
  effect:
    '【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Activate･Main】【Once per Turn】②：If you have a Unit with "Gundam Aerial" in its card name that is Lv.5 or higher in play, deploy 1 [Gundnode]((Quiet Zero)･AP2･HP2･<Breach 1>) Unit token.',
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
      type: "activated",
      activation: {
        timing: ["activate:main"],
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "battleArea",
            cardType: "unit",
            comparison: "gte",
            count: 1,
            attributeFilters: [
              { attribute: "name", comparison: "includes", value: "Gundam Aerial" },
              { attribute: "level", comparison: "gte", value: 5 },
            ],
          },
        ],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      cost: {
        payResources: 2,
      },
      directives: [
        {
          action: {
            action: "deployToken",
            token: {
              name: "Gundnode",
              traits: ["quiet zero"],
              ap: 2,
              hp: 2,
              keywordEffects: [
                {
                  keyword: "Breach",
                  value: 1,
                },
              ],
              deployState: "active",
            },
          },
        },
      ],
      sourceText:
        '【Activate·Main】【Once per Turn】②：If you have a Unit with "Gundam Aerial" in its card name that is Lv.5 or higher in play, deploy 1 [Gundnode]((Quiet Zero)·AP2·HP2·<Breach 1>) Unit token.',
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
