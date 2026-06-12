import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04PsychoGundamMk004: UnitCard = {
  cardNumber: "GD04-004",
  name: "Psycho Gundam Mk-Ⅱ",
  type: "unit",
  color: "blue",
  traits: ["titans"],
  id: "GD04-004",
  externalId: "gundam:gd04-004",
  slug: "psycho-gundam-mk-gd04-004",
  displayName: "Psycho Gundam Mk-Ⅱ",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-004",
  printings: [
    {
      id: "GD04-004",
      collectorNumber: "GD04-004",
      cardNumber: "GD04-004",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-004.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-004.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-004",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-004.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-004.webp?260424",
  legality: "legal",
  level: 8,
  cost: 7,
  ap: 4,
  hp: 7,
  linkCondition: "[Rosamia Badam]",
  effect:
    "<Repair 2> (At the end of your turn, this Unit recovers the specified number of HP.)\n【Once per Turn】When you pair a (Cyber-Newtype) Pilot with one of your blue Units, draw 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        qualification: {
          attribute: "trait",
          comparison: "includes",
          value: "Cyber-Newtype",
        },
        conditions: [
          { type: "eventPlayerIsSelf" },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [{ attribute: "color", comparison: "eq", value: "blue" }],
            },
          },
        ],
        restrictions: [{ type: "oncePerTurn" }],
      },
      directives: [{ action: { action: "draw", count: 1 } }],
      sourceText:
        "【Once per Turn】When you pair a (Cyber-Newtype) Pilot with one of your blue Units, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Repair", value: 2 }],
  rarity: "rare",
};
