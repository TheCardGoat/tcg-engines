import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04CoreFighter013: UnitCard = {
  cardNumber: "GD04-013",
  name: "Core Fighter",
  type: "unit",
  color: "blue",
  traits: ["league militaire", "victory type"],
  id: "GD04-013",
  externalId: "gundam:gd04-013",
  slug: "core-fighter-gd04-013",
  displayName: "Core Fighter",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-013",
  printings: [
    {
      id: "GD04-013",
      collectorNumber: "GD04-013",
      cardNumber: "GD04-013",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-013.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-013.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-013",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-013.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-013.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 2,
  hp: 3,
  linkCondition: "(League Militaire) Trait",
  effect:
    "While this Unit is rested, all your (League Militaire) Unit tokens gain <Blocker>.\n\r\n(Rest this Unit to change the attack target to it.)",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [{ type: "selfIsRested" }],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Blocker",
            duration: "permanent",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: "all",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "league militaire",
                },
              ],
              isToken: true,
            },
          },
        },
      ],
      sourceText:
        "While this Unit is rested, all your (League Militaire) Unit tokens gain <Blocker>. (Rest this Unit to change the attack target to it.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
