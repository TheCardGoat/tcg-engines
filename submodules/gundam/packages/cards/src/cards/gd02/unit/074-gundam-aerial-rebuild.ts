import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GundamAerialRebuild074: UnitCard = {
  cardNumber: "GD02-074",
  name: "Gundam Aerial Rebuild",
  type: "unit",
  color: "white",
  traits: ["academy"],
  id: "GD02-074",
  externalId: "gundam:gd02-074",
  slug: "gundam-aerial-rebuild-gd02-074",
  displayName: "Gundam Aerial Rebuild",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-074",
  printings: [
    {
      id: "GD02-074",
      collectorNumber: "GD02-074",
      cardNumber: "GD02-074",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-074.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-074.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-074",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-074.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-074.webp?260424",
  legality: "legal",
  level: 7,
  cost: 5,
  ap: 5,
  hp: 5,
  effect:
    "&lt;High-Maneuver&gt; (This Unit can't be blocked.)<br>【During Pair】While there are 4 or more Command cards in your trash, this Unit gains &lt;Blocker&gt;.<br>\n(Rest this Unit to change the attack target to it.)<br>",
  effects: [
    // Standalone permanent keyword — always active
    // Conditional constant while paired — gains Blocker when 4+ Commands in trash
    {
      type: "constant",
      activation: {
        conditions: [
          { type: "duringPair" },
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            cardType: "command",
            comparison: "gte",
            count: 4,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Blocker",
            duration: "permanent",
            target: { owner: "self" },
          },
        },
      ],
      sourceText:
        "【During Pair】While there are 4 or more Command cards in your trash, this Unit gains <Blocker>.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "HighManeuver" }],
  rarity: "rare",
};
