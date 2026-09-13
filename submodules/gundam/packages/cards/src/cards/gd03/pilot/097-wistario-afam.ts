import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd03WistarioAfam097: PilotCard = {
  cardNumber: "GD03-097",
  name: "Wistario Afam",
  type: "pilot",
  color: "purple",
  traits: ["civilian"],
  id: "GD03-097",
  canonicalId: "GD03-097",
  externalIds: { bandai: "gundam:gd03-097" },
  slug: "wistario-afam-gd03-097",
  displayName: "Wistario Afam",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-097",
  printings: [
    {
      id: "GD03-097",
      artId: "GD03-097",
      setCode: "GD03",
      collectorNumber: "GD03-097",
      cardNumber: "GD03-097",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd03/GD03-097.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-097.webp?260715",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-097_p1",
      artId: "GD03-097_p1",
      setCode: "SC01",
      collectorNumber: "GD03-097_p1",
      cardNumber: "GD03-097",
      set: {
        code: "SC01",
        name: "Deck Build Box Freedom Ascension [SC01]",
        packageId: "616301",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd03/GD03-097_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-097_p1.webp?260715",
      productName: "Deck Build Box Freedom Ascension [SC01]",
    },
  ],
  reprints: ["GD03-097", "GD03-097_p1"],
  selectedPrintingId: "GD03-097",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd03/GD03-097.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-097.webp?260715",
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
        conditions: [
          { type: "duringLink" },
          { type: "isTurn", whose: "friendly" },
          { type: "eventCardIsSelf" },
        ],
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
