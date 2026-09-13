import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05Dijeh008: UnitCard = {
  cardNumber: "GD05-008",
  name: "Dijeh",
  type: "unit",
  color: "blue",
  traits: ["karaba"],
  id: "GD05-008",
  canonicalId: "GD05-008",
  externalIds: { bandai: "gundam:gd05-008" },
  slug: "dijeh-gd05-008",
  displayName: "Dijeh",
  rulesText:
    "While you have a non-blue (Newtype) Pilot in play, this card in your hand gets cost -2.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-008",
  printings: [
    {
      id: "GD05-008",
      artId: "GD05-008",
      setCode: "GD05",
      collectorNumber: "GD05-008",
      cardNumber: "GD05-008",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-008.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-008",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-008.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Z Gundam",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 4,
  linkCondition: "[Amuro Ray]",
  battlefieldZones: ["earth"],
  effect: "While you have a non-blue (Newtype) Pilot in play, this card in your hand gets cost -2.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "battleArea",
            cardType: "pilot",
            comparison: "gte",
            count: 1,
            hasTrait: "newtype",
            attributeFilters: [{ attribute: "color", comparison: "neq", value: "blue" }],
          },
        ],
      },
      directives: [
        {
          action: {
            action: "costReduction",
            amount: 2,
            target: {
              owner: "self",
              zone: "hand",
            },
          },
        },
      ],
      sourceText:
        "While you have a non-blue (Newtype) Pilot in play, this card in your hand gets cost -2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
