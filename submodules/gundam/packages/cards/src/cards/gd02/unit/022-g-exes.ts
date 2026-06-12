import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GExes022: UnitCard = {
  cardNumber: "GD02-022",
  name: "G-Exes",
  type: "unit",
  color: "green",
  traits: ["earth federation"],
  id: "GD02-022",
  externalId: "gundam:gd02-022",
  slug: "g-exes-gd02-022",
  displayName: "G-Exes",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-022",
  printings: [
    {
      id: "GD02-022",
      collectorNumber: "GD02-022",
      cardNumber: "GD02-022",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-022.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-022.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-022",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-022.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-022.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 3,
  effect:
    "【Once per Turn】When you place an EX Resource, choose 1 of your (AGE System) Units. It gains &lt;Breach 2&gt; during this turn.<br>\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onExResourcePlaced"],
        restrictions: [{ type: "oncePerTurn" }],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 2,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "AGE System" },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Once per Turn】When you place an EX Resource, choose 1 of your (AGE System) Units. It gains <Breach 2> during this turn. (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
