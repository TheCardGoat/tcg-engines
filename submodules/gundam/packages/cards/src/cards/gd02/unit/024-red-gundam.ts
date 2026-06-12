import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02RedGundam024: UnitCard = {
  cardNumber: "GD02-024",
  name: "Red Gundam",
  type: "unit",
  color: "green",
  traits: ["clan"],
  id: "GD02-024",
  externalId: "gundam:gd02-024",
  slug: "red-gundam-gd02-024",
  displayName: "Red Gundam",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-024",
  printings: [
    {
      id: "GD02-024",
      collectorNumber: "GD02-024",
      cardNumber: "GD02-024",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-024.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-024.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-024_p1",
      collectorNumber: "GD02-024_p1",
      cardNumber: "GD02-024",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-024_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-024_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-024",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-024.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-024.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 4,
  hp: 4,
  effect:
    "【During Link】This Unit gains &lt;High-Maneuver&gt;.<br>\n(This Unit can't be blocked.)<br>",
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
  rarity: "rare",
};
