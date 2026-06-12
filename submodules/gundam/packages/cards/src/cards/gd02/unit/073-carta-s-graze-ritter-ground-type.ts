import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02CartaSGrazeRitterGroundType073: UnitCard = {
  cardNumber: "GD02-073",
  name: "Carta's Graze Ritter (Ground Type)",
  type: "unit",
  color: "white",
  traits: ["gjallarhorn"],
  id: "GD02-073",
  externalId: "gundam:gd02-073",
  slug: "carta-s-graze-ritter-ground-type-gd02-073",
  displayName: "Carta's Graze Ritter (Ground Type)",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-073",
  printings: [
    {
      id: "GD02-073",
      collectorNumber: "GD02-073",
      cardNumber: "GD02-073",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-073.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-073.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-073_p1",
      collectorNumber: "GD02-073_p1",
      cardNumber: "GD02-073",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-073_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-073_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-073",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-073.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-073.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 5,
  hp: 4,
  effect:
    "During your opponent's turn, the enemy Unit battling this Unit gains &lt;First Strike&gt;.<br>\n(While this Unit is attacking, it deals damage before the enemy Unit.)<br>",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "isTurn",
            whose: "opponent",
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
              owner: "opponent",
              cardType: "unit",
              // "the enemy Unit BATTLING this Unit" — narrow the grant to
              // the single opponent currently in combat with Carta via the
              // TargetFilter.isBattling predicate. With no active combat
              // the battling set is empty and the grant applies to no one,
              // which matches the printed semantics.
              isBattling: true,
            },
          },
        },
      ],
      sourceText:
        "During your opponent's turn, the enemy Unit battling this Unit gains <First Strike>. (While this Unit is attacking, it deals damage before the enemy Unit.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
