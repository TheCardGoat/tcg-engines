import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04Gundam008: UnitCard = {
  cardNumber: "GD04-008",
  name: "Gundam",
  type: "unit",
  color: "blue",
  traits: ["earth federation", "white base team"],
  id: "GD04-008",
  externalId: "gundam:gd04-008",
  slug: "gundam-gd04-008",
  displayName: "Gundam",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-008",
  printings: [
    {
      id: "GD04-008",
      collectorNumber: "GD04-008",
      cardNumber: "GD04-008",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-008.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-008.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-008",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-008.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-008.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 4,
  hp: 4,
  linkCondition: "[Amuro Ray]",
  effect: "【During Link】This Unit gains <High-Maneuver>.\n\r\n(This Unit can't be blocked.)",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "HighManeuver",
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText: "【During Link】This Unit gains <High-Maneuver>. (This Unit can't be blocked.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
