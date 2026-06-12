import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd02LalahSune089: PilotCard = {
  cardNumber: "GD02-089",
  name: "Lalah Sune",
  type: "pilot",
  color: "green",
  traits: ["zeon", "newtype"],
  id: "GD02-089",
  externalId: "gundam:gd02-089",
  slug: "lalah-sune-gd02-089",
  displayName: "Lalah Sune",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-089",
  printings: [
    {
      id: "GD02-089",
      collectorNumber: "GD02-089",
      cardNumber: "GD02-089",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-089.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-089.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-089",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-089.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-089.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【When Paired】Choose 1 of your other (Zeon) Link Units. It gains &lt;Breach 1&gt; during this turn.<br>\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addSelfToHand",
          },
        },
      ],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 1,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "zeon",
                },
              ],
              isLinkUnit: true,
              excludeSource: true,
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【When Paired】Choose 1 of your other (Zeon) Link Units. It gains <Breach 1> during this turn. (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
