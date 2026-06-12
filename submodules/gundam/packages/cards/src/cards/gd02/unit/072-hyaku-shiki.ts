import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02HyakuShiki072: UnitCard = {
  cardNumber: "GD02-072",
  name: "Hyaku-Shiki",
  type: "unit",
  color: "white",
  traits: ["aeug"],
  id: "GD02-072",
  externalId: "gundam:gd02-072",
  slug: "hyaku-shiki-gd02-072",
  displayName: "Hyaku-Shiki",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-072",
  printings: [
    {
      id: "GD02-072",
      collectorNumber: "GD02-072",
      cardNumber: "GD02-072",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-072.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-072.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-072_p1",
      collectorNumber: "GD02-072_p1",
      cardNumber: "GD02-072",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-072_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-072_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-072",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-072.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-072.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 4,
  hp: 4,
  effect:
    "&lt;Blocker&gt; (Rest this Unit to change the attack target to it.)<br>While a friendly white Base is in play, this Unit gains &lt;Repair 1&gt;.<br>\n(At the end of your turn, this Unit recovers the specified number of HP.)<br>",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "friendlyBaseInPlay",
            color: "white",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Repair",
            keywordValue: 1,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While a friendly white Base is in play, this Unit gains <Repair 1>. (At the end of your turn, this Unit recovers the specified number of HP.)",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "rare",
};
