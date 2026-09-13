import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05ShiningGundam066: UnitCard = {
  cardNumber: "GD05-066",
  name: "Shining Gundam",
  type: "unit",
  color: "white",
  traits: ["mf", "shuffle alliance"],
  id: "GD05-066",
  canonicalId: "GD05-066",
  externalIds: { bandai: "gundam:gd05-066" },
  slug: "shining-gundam-gd05-066",
  displayName: "Shining Gundam",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-066",
  printings: [
    {
      id: "GD05-066",
      artId: "GD05-066",
      setCode: "GD05",
      collectorNumber: "GD05-066",
      cardNumber: "GD05-066",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-066.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-066.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-066_p1",
      artId: "GD05-066_p1",
      setCode: "GD05",
      collectorNumber: "GD05-066_p1",
      cardNumber: "GD05-066",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-066_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-066_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-066", "GD05-066_p1"],
  selectedPrintingId: "GD05-066",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-066.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-066.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Fighter G Gundam",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 4,
  linkCondition: "[Domon Kasshu]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Deploy】You may choose 2 (MF) Unit cards from your trash. Exile them from the game. If you do, choose 1 (Special Move) Command card from your trash. Add it to your hand.\n【Attack】【Once per Turn】Choose 1 of your rested Resources. Set it as active.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "resolveThenQueue",
            first: {
              action: "exile",
              target: {
                owner: "friendly",
                cardType: "unit",
                attributeFilters: [
                  {
                    attribute: "trait",
                    comparison: "includes",
                    value: "mf",
                  },
                ],
                zone: "trash",
                count: 2,
              },
            },
            followUp: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  action: {
                    action: "addFromTrash",
                    target: {
                      owner: "friendly",
                      cardType: "command",
                      attributeFilters: [
                        {
                          attribute: "trait",
                          comparison: "includes",
                          value: "special move",
                        },
                      ],
                      zone: "trash",
                      count: 1,
                    },
                  },
                },
              ],
              sourceText:
                "If you do, choose 1 (Special Move) Command card from your trash. Add it to your hand.",
            },
          },
          optional: true,
        },
      ],
      sourceText:
        "【Deploy】You may choose 2 (MF) Unit cards from your trash. Exile them from the game. If you do, choose 1 (Special Move) Command card from your trash. Add it to your hand.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "setActive",
            target: {
              owner: "friendly",
              cardType: "resource",
              state: "rested",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Attack】【Once per Turn】Choose 1 of your rested Resources. Set it as active.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
