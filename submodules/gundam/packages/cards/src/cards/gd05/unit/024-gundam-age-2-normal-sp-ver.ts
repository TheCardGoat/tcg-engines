import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05GundamAge2NormalSpVer024: UnitCard = {
  cardNumber: "GD05-024",
  name: "Gundam AGE-2 Normal (SP Ver.)",
  type: "unit",
  color: "green",
  traits: ["earth federation", "age system"],
  id: "GD05-024",
  canonicalId: "GD05-024",
  externalIds: { bandai: "gundam:gd05-024" },
  slug: "gundam-age-2-normal-sp-ver-gd05-024",
  displayName: "Gundam AGE-2 Normal (SP Ver.)",
  rulesText:
    "【Destroyed】Choose 1 green (Earth Federation) Pilot card from your trash. Add it to your hand. If you do, discard 1.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-024",
  printings: [
    {
      id: "GD05-024",
      artId: "GD05-024",
      setCode: "GD05",
      collectorNumber: "GD05-024",
      cardNumber: "GD05-024",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-024.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-024",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-024.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam AGE",
  level: 5,
  cost: 3,
  ap: 4,
  hp: 3,
  linkCondition: "[Asemu Asuno]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Destroyed】Choose 1 green (Earth Federation) Pilot card from your trash. Add it to your hand. If you do, discard 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
      },
      directives: [
        {
          action: {
            action: "resolveThenQueue",
            first: {
              action: "addFromTrash",
              target: {
                owner: "friendly",
                cardType: "pilot",
                attributeFilters: [
                  {
                    attribute: "color",
                    comparison: "eq",
                    value: "green",
                  },
                  {
                    attribute: "trait",
                    comparison: "includes",
                    value: "earth federation",
                  },
                ],
                zone: "trash",
                count: 1,
              },
            },
            followUp: {
              type: "triggered",
              activation: {},
              directives: [{ action: { action: "discard", count: 1 } }],
              sourceText: "Then, discard 1.",
            },
          },
        },
      ],
      sourceText:
        "【Destroyed】Choose 1 green (Earth Federation) Pilot card from your trash. Add it to your hand. If you do, discard 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
