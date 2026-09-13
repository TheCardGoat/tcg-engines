import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01PsychoZaku059: UnitCard = {
  cardNumber: "EB01-059",
  name: "Psycho Zaku",
  type: "unit",
  color: "white",
  traits: ["g generation"],
  id: "EB01-059",
  canonicalId: "EB01-059",
  externalIds: { bandai: "gundam:eb01-059" },
  slug: "psycho-zaku-eb01-059",
  displayName: "Psycho Zaku",
  rulesText:
    "【During Link】【Attack】【Once per Turn】All players each choose 1 of their Resources. Set them as active.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-059",
  printings: [
    {
      id: "EB01-059",
      artId: "EB01-059",
      setCode: "EB01",
      collectorNumber: "EB01-059",
      cardNumber: "EB01-059",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-059.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-059",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-059.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 5,
  cost: 3,
  ap: 4,
  hp: 4,
  linkCondition: "[Daryl Lorenz]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【During Link】【Attack】【Once per Turn】All players each choose 1 of their Resources. Set them as active.",
  effects: [
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
          action: {
            action: "queueEffectForPlayers",
            scope: "all",
            effect: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  action: {
                    action: "setActive",
                    target: { owner: "friendly", cardType: "resource", count: 1 },
                  },
                },
              ],
              sourceText: "Choose 1 of your Resources. Set it as active.",
            },
          },
        },
      ],
      sourceText:
        "【During Link】【Attack】【Once per Turn】All players each choose 1 of their Resources. Set them as active.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
