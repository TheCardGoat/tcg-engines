import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01Zno063: UnitCard = {
  cardNumber: "GD01-063",
  name: "ZnO",
  type: "unit",
  color: "red",
  traits: ["zaft"],
  id: "GD01-063",
  externalId: "gundam:gd01-063",
  slug: "zno-gd01-063",
  displayName: "ZnO",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-063",
  printings: [
    {
      id: "GD01-063",
      collectorNumber: "GD01-063",
      cardNumber: "GD01-063",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-063.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-063.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-063",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-063.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-063.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 2,
  hp: 1,
  effect:
    "During your turn, while this Unit is battling an enemy Unit that is Lv.2 or lower, it gains &lt;First Strike&gt;.<br>\n(While this Unit is attacking, it deals damage before the enemy Unit.)<br>",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "isTurn",
            whose: "friendly",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "FirstStrike",
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
              // "while this Unit is BATTLING an enemy Unit that is Lv.2
              // or lower" — ZnO must itself be in combat AND the other
              // combatant must be an enemy Unit at Lv.≤2. Expressed via
              // the relational `isBattling.opponentMatches` sub-filter.
              isBattling: {
                opponentMatches: {
                  owner: "opponent",
                  cardType: "unit",
                  attributeFilters: [{ attribute: "level", comparison: "lte", value: 2 }],
                },
              },
            },
          },
        },
      ],
      sourceText:
        "During your turn, while this Unit is battling an enemy Unit that is Lv.2 or lower, it gains <First Strike>. (While this Unit is attacking, it deals damage before the enemy Unit.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
