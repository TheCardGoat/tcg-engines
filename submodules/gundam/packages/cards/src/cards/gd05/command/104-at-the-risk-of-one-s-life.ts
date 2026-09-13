import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd05AtTheRiskOfOneSLife104: CommandCard = {
  cardNumber: "GD05-104",
  name: "At the Risk of One's Life",
  type: "command",
  color: "blue",
  traits: ["league militaire", "shrike team"],
  id: "GD05-104",
  canonicalId: "GD05-104",
  externalIds: { bandai: "gundam:gd05-104" },
  slug: "at-the-risk-of-one-s-life-gd05-104",
  displayName: "At the Risk of One's Life",
  rulesText:
    "【Action】Choose 1 friendly (Shrike Team) Unit. It gains the following effect during this turn:\n\n■【During Link】【Destroyed】Choose 1 friendly (League Militaire) Unit. Set it as active.\n【Pilot】[Helen Jackson]",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-104",
  printings: [
    {
      id: "GD05-104",
      artId: "GD05-104",
      setCode: "GD05",
      collectorNumber: "GD05-104",
      cardNumber: "GD05-104",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-104.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-104",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-104.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit V Gundam",
  level: 3,
  cost: 1,
  pilotName: "Helen Jackson",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Action】Choose 1 friendly (Shrike Team) Unit. It gains the following effect during this turn:\n\n■【During Link】【Destroyed】Choose 1 friendly (League Militaire) Unit. Set it as active.\n【Pilot】[Helen Jackson]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "createDelayedTrigger",
            duration: "thisTurn",
            eventType: "unitDestroyed",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "shrike team",
                },
              ],
              count: 1,
            },
            eventCardFilter: {
              owner: "friendly",
              cardType: "unit",
              isLinkUnit: true,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "shrike team",
                },
              ],
            },
            effect: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  action: {
                    action: "setActive",
                    target: {
                      owner: "friendly",
                      cardType: "unit",
                      attributeFilters: [
                        {
                          attribute: "trait",
                          comparison: "includes",
                          value: "league militaire",
                        },
                      ],
                      count: 1,
                    },
                  },
                },
              ],
              sourceText: "Choose 1 friendly (League Militaire) Unit. Set it as active.",
            },
          },
        },
      ],
      sourceText:
        "【Action】Choose 1 friendly (Shrike Team) Unit. It gains the following effect during this turn: ■【During Link】【Destroyed】Choose 1 friendly (League Militaire) Unit. Set it as active.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
