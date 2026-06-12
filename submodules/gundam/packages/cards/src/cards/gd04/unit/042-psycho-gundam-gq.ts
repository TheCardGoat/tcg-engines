import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04PsychoGundamGq042: UnitCard = {
  cardNumber: "GD04-042",
  name: "Psycho Gundam (GQ)",
  type: "unit",
  color: "red",
  traits: ["earth federation"],
  id: "GD04-042",
  externalId: "gundam:gd04-042",
  slug: "psycho-gundam-gq-gd04-042",
  displayName: "Psycho Gundam (GQ)",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-042",
  printings: [
    {
      id: "GD04-042",
      collectorNumber: "GD04-042",
      cardNumber: "GD04-042",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-042.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-042.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-042_p1",
      collectorNumber: "GD04-042_p1",
      cardNumber: "GD04-042",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-042_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-042_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-042",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-042.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-042.webp?260424",
  legality: "legal",
  level: 7,
  cost: 5,
  ap: 4,
  hp: 5,
  linkCondition: "[Deux Murasame]",
  effect:
    "【During Link】【Once per Turn】When damage from one of your Units paired with a (Cyber-Newtype) Pilot destroys an enemy shield area card, choose 1 enemy Unit with 5 or less AP. Deal 2 damage to it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onShieldAreaCardDestroyByBattle"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
        conditions: [
          { type: "duringLink" },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "pairedPilotTrait",
                  comparison: "includes",
                  value: "cyber-newtype",
                },
              ],
            },
          },
        ],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "ap", comparison: "lte", value: 5 }],
            },
          },
        },
      ],
      sourceText:
        "【During Link】【Once per Turn】When damage from one of your Units paired with a (Cyber-Newtype) Pilot destroys an enemy shield area card, choose 1 enemy Unit with 5 or less AP. Deal 2 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
