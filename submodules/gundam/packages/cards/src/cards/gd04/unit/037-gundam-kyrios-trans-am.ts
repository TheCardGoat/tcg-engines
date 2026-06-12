import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GundamKyriosTransAm037: UnitCard = {
  cardNumber: "GD04-037",
  name: "Gundam Kyrios (Trans-Am)",
  type: "unit",
  color: "red",
  traits: ["cb", "gn drive"],
  id: "GD04-037",
  externalId: "gundam:gd04-037",
  slug: "gundam-kyrios-trans-am-gd04-037",
  displayName: "Gundam Kyrios (Trans-Am)",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-037",
  printings: [
    {
      id: "GD04-037",
      collectorNumber: "GD04-037",
      cardNumber: "GD04-037",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-037.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-037.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-037",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-037.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-037.webp?260424",
  legality: "legal",
  level: 6,
  cost: 5,
  ap: 5,
  hp: 4,
  linkCondition: "[Allelujah Haptism] / [Hallelujah Haptism]",
  effect:
    "While you have a red (Super Soldier) Pilot in play, this Unit gains <First Strike>.\n\r\n(While this Unit is attacking, it deals damage before the enemy Unit.)\nWhile you have a green (Super Soldier) Pilot in play, this Unit gains <Breach 3>.\n\r\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
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
            hasTrait: "super soldier",
            hasColor: "red",
            comparison: "gte",
            count: 1,
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
            },
          },
        },
      ],
      sourceText:
        "While you have a red (Super Soldier) Pilot in play, this Unit gains <First Strike>. (While this Unit is attacking, it deals damage before the enemy Unit.)",
    },
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "battleArea",
            cardType: "pilot",
            hasTrait: "super soldier",
            hasColor: "green",
            comparison: "gte",
            count: 1,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 3,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While you have a green (Super Soldier) Pilot in play, this Unit gains <Breach 3>. (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
