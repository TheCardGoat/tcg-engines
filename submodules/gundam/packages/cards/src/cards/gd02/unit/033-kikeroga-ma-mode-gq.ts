import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02KikerogaMaModeGq033: UnitCard = {
  cardNumber: "GD02-033",
  name: "Kikeroga (MA Mode) (GQ)",
  type: "unit",
  color: "green",
  traits: ["zeon"],
  id: "GD02-033",
  externalId: "gundam:gd02-033",
  slug: "kikeroga-ma-mode-gq-gd02-033",
  displayName: "Kikeroga (MA Mode) (GQ)",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-033",
  printings: [
    {
      id: "GD02-033",
      collectorNumber: "GD02-033",
      cardNumber: "GD02-033",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-033.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-033.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-033",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-033.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-033.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 3,
  hp: 4,
  effect:
    "While another friendly (Zeon) Link Unit is in play, this Unit gains &lt;Breach 5&gt;.<br>\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)<br>",
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
            isLinkUnit: true,
            hasTrait: "zeon",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 5,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While another friendly (Zeon) Link Unit is in play, this Unit gains <Breach 5>. (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
