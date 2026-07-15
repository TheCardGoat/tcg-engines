import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04Gundam069: UnitCard = {
  cardNumber: "GD04-069",
  name: "∀ Gundam",
  type: "unit",
  color: "white",
  traits: ["militia"],
  id: "GD04-069",
  canonicalId: "GD04-069",
  externalIds: { bandai: "gundam:gd04-069" },
  slug: "gundam/gd04-069",
  displayName: "∀ Gundam",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-069",
  printings: [
    {
      id: "GD04-069",
      artId: "GD04-069",
      setCode: "GD04",
      collectorNumber: "GD04-069",
      cardNumber: "GD04-069",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-069.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-069.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  reprints: ["GD04-069"],
  selectedPrintingId: "GD04-069",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-069.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-069.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 4,
  hp: 3,
  linkCondition: "[Loran Cehack]",
  effect:
    "<Blocker> (Rest this Unit to change the attack target to it.)\n【During Link】At the end of a turn where you have paid ① or more for one of your other (Militia)/(Dianna Counter) Units' effects, choose 1 of your (Militia) Units. Set it as active.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onUnitEffectCostPaid"],
        restrictions: [{ type: "oncePerTurn" }],
        conditions: [
          { type: "duringLink" },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              excludeSource: true,
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    { attribute: "trait", comparison: "includes", value: "militia" },
                    { attribute: "trait", comparison: "includes", value: "dianna counter" },
                  ],
                },
              ],
            },
          },
        ],
      },
      directives: [
        {
          action: {
            action: "createDelayedTrigger",
            duration: "thisTurn",
            eventType: "turnEnded",
            eventCardFilter: { owner: "self", cardType: "unit" },
            effect: {
              type: "triggered",
              activation: {
                timing: ["endOfTurn"],
                conditions: [{ type: "duringLink" }],
              },
              directives: [
                {
                  action: {
                    action: "setActive",
                    target: {
                      owner: "friendly",
                      cardType: "unit",
                      state: "rested",
                      count: 1,
                      attributeFilters: [
                        {
                          attribute: "trait",
                          comparison: "includes",
                          value: "militia",
                        },
                      ],
                    },
                  },
                },
              ],
              sourceText:
                "At the end of the turn, choose 1 of your (Militia) Units. Set it as active.",
            },
          },
        },
      ],
      sourceText:
        "【During Link】At the end of a turn where you have paid ① or more for one of your other (Militia)/(Dianna Counter) Units' effects, choose 1 of your (Militia) Units. Set it as active.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "rare",
};
