import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01HiNuGundamEx002: UnitCard = {
  cardNumber: "EB01-002",
  name: "Hi-Nu Gundam (EX)",
  type: "unit",
  color: "blue",
  traits: ["g generation"],
  id: "EB01-002",
  canonicalId: "EB01-002",
  externalIds: { bandai: "gundam:eb01-002" },
  slug: "hi-nu-gundam-ex-eb01-002",
  displayName: "Hi-Nu Gundam (EX)",
  rulesText:
    "【Deploy】If another friendly (G Generation) Unit is in play, choose 1 Unit belonging to each enemy player. Rest them.\n【During Link】【Attack】【Once per Turn】If 3 or more other rested Units are in play, set this Unit as active.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-002",
  printings: [
    {
      id: "EB01-002",
      artId: "EB01-002",
      setCode: "EB01",
      collectorNumber: "EB01-002",
      cardNumber: "EB01-002",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-002.webp",
      productName: "Eternal Nexus [EB01]",
    },
    {
      id: "EB01-002-p1",
      artId: "EB01-002_p1",
      setCode: "EB01",
      collectorNumber: "EB01-002-p1",
      cardNumber: "EB01-002",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-002_p1.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-002",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-002.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 8,
  cost: 7,
  ap: 6,
  hp: 5,
  linkCondition: "(G Generation) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Deploy】If another friendly (G Generation) Unit is in play, choose 1 Unit belonging to each enemy player. Rest them.\n【During Link】【Attack】【Once per Turn】If 3 or more other rested Units are in play, set this Unit as active.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            excludeSelf: true,
            hasTrait: "g generation",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Deploy】If another friendly (G Generation) Unit is in play, choose 1 Unit belonging to each enemy player. Rest them.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          {
            type: "duringLink",
          },
        ],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "any",
            comparison: "gte",
            count: 3,
            state: "rested",
            excludeSelf: true,
          },
          thenDirectives: [
            {
              action: {
                action: "setActive",
                target: {
                  owner: "self",
                  cardType: "unit",
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【During Link】【Attack】【Once per Turn】If 3 or more other rested Units are in play, set this Unit as active.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
