import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03WarpedIntent112: CommandCard = {
  cardNumber: "GD03-112",
  name: "Warped Intent",
  type: "command",
  color: "red",
  traits: [],
  id: "GD03-112",
  externalId: "gundam:gd03-112",
  slug: "warped-intent-gd03-112",
  displayName: "Warped Intent",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-112",
  printings: [
    {
      id: "GD03-112",
      collectorNumber: "GD03-112",
      cardNumber: "GD03-112",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-112.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-112.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-112",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-112.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-112.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  effect:
    "【Burst】Add this card to your hand.\n【Main】/【Action】During this turn, all Units paired with a Pilot get AP+2.",
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
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisTurn",
            target: {
              owner: "any",
              cardType: "unit",
              attributeFilters: [{ attribute: "paired", comparison: "eq", value: true }],
            },
          },
        },
      ],
      sourceText: "【Main】/【Action】During this turn, all Units paired with a Pilot get AP+2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
