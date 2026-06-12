import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GaelioSSchwalbeGraze082: UnitCard = {
  cardNumber: "GD02-082",
  name: "Gaelio's Schwalbe Graze",
  type: "unit",
  color: "white",
  traits: ["gjallarhorn"],
  id: "GD02-082",
  externalId: "gundam:gd02-082",
  slug: "gaelio-s-schwalbe-graze-gd02-082",
  displayName: "Gaelio's Schwalbe Graze",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-082",
  printings: [
    {
      id: "GD02-082",
      collectorNumber: "GD02-082",
      cardNumber: "GD02-082",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-082.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-082.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-082",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-082.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-082.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 3,
  effect:
    "While you have another (Gjallarhorn) Unit in play, this Unit gains &lt;Blocker&gt;.<br>\n(Rest this Unit to change the attack target to it.)<br>",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            excludeSelf: true,
            hasTrait: "gjallarhorn",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Blocker",
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While you have another (Gjallarhorn) Unit in play, this Unit gains <Blocker>. (Rest this Unit to change the attack target to it.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
