import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02Hyakuri061: UnitCard = {
  cardNumber: "GD02-061",
  name: "Hyakuri",
  type: "unit",
  battlefieldZones: ["space"],
  color: "purple",
  traits: ["teiwaz"],
  id: "GD02-061",
  canonicalId: "GD02-061",
  externalIds: { bandai: "gundam:gd02-061" },
  slug: "hyakuri/gd02-061",
  displayName: "Hyakuri",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-061",
  printings: [
    {
      id: "GD02-061",
      artId: "GD02-061",
      setCode: "GD02",
      collectorNumber: "GD02-061",
      cardNumber: "GD02-061",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-061.webp",
      productName: "Dual Impact [GD02]",
    },
  ],
  reprints: ["GD02-061"],
  selectedPrintingId: "GD02-061",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-061.webp",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 3,
  hp: 3,
  linkCondition: "(Teiwaz) Trait",
  effect:
    "【When Paired･Purple Pilot】If there are 3 or more (Teiwaz)/(Tekkadan) cards in your trash, choose 1 enemy Unit with 3 or less AP. Rest it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        qualification: { attribute: "color", comparison: "eq", value: "purple" },
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 3,
            hasTrait: ["teiwaz", "tekkadan"],
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
              attributeFilters: [{ attribute: "ap", comparison: "lte", value: 3 }],
            },
          },
        },
      ],
      sourceText:
        "【When Paired·Purple Pilot】If there are 3 or more (Teiwaz)/(Tekkadan) cards in your trash, choose 1 enemy Unit with 3 or less AP. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
