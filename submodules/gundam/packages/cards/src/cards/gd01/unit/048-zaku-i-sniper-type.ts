import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01ZakuISniperType048: UnitCard = {
  cardNumber: "GD01-048",
  name: "Zaku I Sniper Type",
  type: "unit",
  color: "red",
  traits: ["zeon"],
  id: "GD01-048",
  externalId: "gundam:gd01-048",
  slug: "zaku-i-sniper-type-gd01-048",
  displayName: "Zaku I Sniper Type",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-048",
  printings: [
    {
      id: "GD01-048",
      collectorNumber: "GD01-048",
      cardNumber: "GD01-048",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-048.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-048.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-048",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-048.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-048.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 0,
  hp: 1,
  effect:
    "【Activate･Main】&lt;Support 1&gt; (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)<br>【Deploy】Look at the top card of your deck. If it is a (Zeon)/(Neo Zeon) Unit card, you may reveal it and add it to your hand. Return any remaining card to the bottom of your deck.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "lookAtTopDeck",
            count: 1,
            return: "chooseTop",
            tutorFilter: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    { attribute: "trait", comparison: "includes", value: "zeon" },
                    { attribute: "trait", comparison: "includes", value: "neo zeon" },
                  ],
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Look at the top card of your deck. If it is a (Zeon)/(Neo Zeon) Unit card, you may reveal it and add it to your hand. Return any remaining card to the bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Support", value: 1 }],
  rarity: "rare",
};
