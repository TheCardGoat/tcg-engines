import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd03WistarioAfam097: PilotCard = {
  cardNumber: "GD03-097",
  name: "Wistario Afam",
  type: "pilot",
  color: "purple",
  traits: ["civilian"],
  id: "GD03-097",
  externalId: "gundam:gd03-097",
  slug: "wistario-afam-gd03-097",
  displayName: "Wistario Afam",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-097",
  printings: [
    {
      id: "GD03-097",
      collectorNumber: "GD03-097",
      cardNumber: "GD03-097",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-097.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-097.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-097",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-097.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-097.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\n【During Link】【Once per Turn】During your turn, when this Unit destroys an enemy Unit with battle damage, look at the top 2 cards of your deck and return 1 to the top. Place the remaining card into your trash.",
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
        timing: ["onDestroyByBattle"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
        conditions: [{ type: "duringLink" }, { type: "isTurn", whose: "friendly" }],
      },
      directives: [
        {
          action: {
            action: "lookAtTopDeck",
            count: 2,
            return: "chooseTop",
            remainingDestination: "trash",
          },
        },
      ],
      sourceText:
        "【During Link】【Once per Turn】During your turn, when this Unit destroys an enemy Unit with battle damage, look at the top 2 cards of your deck and return 1 to the top. Place the remaining card into your trash.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
