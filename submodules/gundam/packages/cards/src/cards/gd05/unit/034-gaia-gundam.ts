import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05GaiaGundam034: UnitCard = {
  cardNumber: "GD05-034",
  name: "Gaia Gundam",
  type: "unit",
  color: "red",
  traits: ["earth alliance", "phantom pain"],
  id: "GD05-034",
  canonicalId: "GD05-034",
  externalIds: { bandai: "gundam:gd05-034" },
  slug: "gaia-gundam-gd05-034",
  displayName: "Gaia Gundam",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-034",
  printings: [
    {
      id: "GD05-034",
      artId: "GD05-034",
      setCode: "GD05",
      collectorNumber: "GD05-034",
      cardNumber: "GD05-034",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-034.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-034.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-034_p1",
      artId: "GD05-034_p1",
      setCode: "GD05",
      collectorNumber: "GD05-034_p1",
      cardNumber: "GD05-034",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-034_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-034_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-034", "GD05-034_p1"],
  selectedPrintingId: "GD05-034",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-034.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-034.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED Destiny",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 3,
  linkCondition: "[Stellar Loussier]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【During Pair】【Once per Turn】When this Unit destroys an enemy shield area card with battle damage, that enemy player may discard 1. If they don't discard with this effect, you may deploy 1 (Phantom Pain) Unit card that is Lv.4 or lower from your hand.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onShieldAreaCardDestroyByBattle"],
        conditions: [
          {
            type: "duringPair",
          },
          {
            type: "eventCardIsSelf",
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
            action: "queueEffectForOpponent",
            effect: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  condition: {
                    type: "handCount",
                    owner: "friendly",
                    comparison: "gte",
                    count: 1,
                  },
                  thenDirectives: [
                    {
                      kind: "chooseOne",
                      options: [
                        {
                          label: "Discard 1 card",
                          directives: [
                            {
                              action: {
                                action: "resolveThenQueue",
                                followUp: {
                                  type: "triggered",
                                  activation: { timing: [] },
                                  directives: [{ action: { action: "discard", count: 1 } }],
                                  sourceText: "Choose 1 card from your hand to discard.",
                                },
                              },
                            },
                          ],
                        },
                        {
                          label: "Do not discard",
                          directives: [
                            {
                              action: {
                                action: "queueEffectForOpponent",
                                effect: {
                                  type: "triggered",
                                  activation: { timing: [] },
                                  directives: [
                                    {
                                      optional: true,
                                      action: {
                                        action: "deploy",
                                        target: {
                                          owner: "friendly",
                                          zone: "hand",
                                          count: 1,
                                          cardType: "unit",
                                          attributeFilters: [
                                            {
                                              attribute: "trait",
                                              comparison: "includes",
                                              value: "phantom pain",
                                            },
                                            {
                                              attribute: "level",
                                              comparison: "lte",
                                              value: 4,
                                            },
                                          ],
                                        },
                                      },
                                    },
                                  ],
                                  sourceText:
                                    "You may deploy 1 (Phantom Pain) Unit card that is Lv.4 or lower from your hand.",
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  elseDirectives: [
                    {
                      action: {
                        action: "queueEffectForOpponent",
                        effect: {
                          type: "triggered",
                          activation: { timing: [] },
                          directives: [
                            {
                              optional: true,
                              action: {
                                action: "deploy",
                                target: {
                                  owner: "friendly",
                                  zone: "hand",
                                  count: 1,
                                  cardType: "unit",
                                  attributeFilters: [
                                    {
                                      attribute: "trait",
                                      comparison: "includes",
                                      value: "phantom pain",
                                    },
                                    {
                                      attribute: "level",
                                      comparison: "lte",
                                      value: 4,
                                    },
                                  ],
                                },
                              },
                            },
                          ],
                          sourceText:
                            "You may deploy 1 (Phantom Pain) Unit card that is Lv.4 or lower from your hand.",
                        },
                      },
                    },
                  ],
                },
              ],
              sourceText:
                "You may discard 1. If you don't, your opponent may deploy a qualifying Unit.",
            },
          },
        },
      ],
      sourceText:
        "【During Pair】【Once per Turn】When this Unit destroys an enemy shield area card with battle damage, that enemy player may discard 1. If they don't discard with this effect, you may deploy 1 (Phantom Pain) Unit card that is Lv.4 or lower from your hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
