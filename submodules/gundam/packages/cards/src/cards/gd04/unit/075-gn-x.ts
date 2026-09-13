import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GnX075: UnitCard = {
  cardNumber: "GD04-075",
  name: "GN-X",
  type: "unit",
  color: "white",
  traits: ["un"],
  id: "GD04-075",
  canonicalId: "GD04-075",
  externalIds: { bandai: "gundam:gd04-075" },
  slug: "gn-x/gd04-075",
  displayName: "GN-X",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-075",
  printings: [
    {
      id: "GD04-075",
      artId: "GD04-075",
      setCode: "GD04",
      collectorNumber: "GD04-075",
      cardNumber: "GD04-075",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd04/GD04-075.webp",
      productName: "Phantom Aria [GD04]",
    },
  ],
  reprints: ["GD04-075"],
  selectedPrintingId: "GD04-075",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd04/GD04-075.webp",
  legality: "legal",
  level: 4,
  cost: 6,
  ap: 5,
  hp: 3,
  linkCondition: "(UN) Trait",
  effect:
    "Reduce the cost of this card in your hand by an amount equal to the number of (UN)/(Superpower Bloc) Command cards in your trash.",
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "costReductionByCount",
            amountPerMatch: 1,
            countFilter: {
              owner: "friendly",
              zone: "trash",
              cardType: "command",
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    { attribute: "trait", comparison: "includes", value: "un" },
                    { attribute: "trait", comparison: "includes", value: "superpower bloc" },
                  ],
                },
              ],
            },
            target: {
              owner: "self",
              zone: "hand",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "Reduce the cost of this card in your hand by an amount equal to the number of (UN)/(Superpower Bloc) Command cards in your trash.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
