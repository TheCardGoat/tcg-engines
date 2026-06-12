import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd03CyclopsTeam126: BaseCard = {
  cardNumber: "GD03-126",
  name: "Cyclops Team",
  type: "base",
  traits: ["zeon", "cyclops team"],
  id: "GD03-126",
  externalId: "gundam:gd03-126",
  slug: "cyclops-team-gd03-126",
  displayName: "Cyclops Team",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-126",
  printings: [
    {
      id: "GD03-126",
      collectorNumber: "GD03-126",
      cardNumber: "GD03-126",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-126.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-126.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-126",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-126.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-126.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\r\nAll friendly Unit tokens get AP+1 during your opponent's turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "deploySelf",
          },
        },
      ],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "addShieldToHand",
            count: 1,
          },
        },
      ],
      sourceText: "【Deploy】Add 1 of your Shields to your hand.",
    },
    {
      type: "constant",
      activation: {
        conditions: [{ type: "isTurn", whose: "opponent" }],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "permanent",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: "all",
              isToken: true,
            },
          },
        },
      ],
      sourceText: "All friendly Unit tokens get AP+1 during your opponent's turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
