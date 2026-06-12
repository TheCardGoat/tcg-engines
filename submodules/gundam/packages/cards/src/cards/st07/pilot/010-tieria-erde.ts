import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st07TieriaErde010: PilotCard = {
  cardNumber: "ST07-010",
  name: "Tieria Erde",
  type: "pilot",
  color: "purple",
  traits: ["cb", "innovade"],
  id: "ST07-010",
  externalId: "gundam:st07-010",
  slug: "tieria-erde-st07-010",
  displayName: "Tieria Erde",
  set: { code: "ST07", name: "Celestial Drive [ST07]", packageId: "616007" },
  printNumber: "ST07-010",
  printings: [
    {
      id: "ST07-010",
      collectorNumber: "ST07-010",
      cardNumber: "ST07-010",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07]",
        packageId: "616007",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-010.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-010.webp?260424",
      productName: "Celestial Drive [ST07]",
    },
    {
      id: "ST07-010_p1",
      collectorNumber: "ST07-010_p1",
      cardNumber: "ST07-010",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07] Bonus Pack",
        packageId: "616007",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-010_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-010_p1.webp?260424",
      productName: "Celestial Drive [ST07] Bonus Pack",
    },
    {
      id: "ST07-010_p2",
      collectorNumber: "ST07-010_p2",
      cardNumber: "ST07-010",
      set: {
        code: "ST07",
        name: "Store Tournament Participant Pack 03",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-010_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-010_p2.webp?260424",
      productName: "Store Tournament Participant Pack 03",
    },
    {
      id: "ST07-010_p3",
      collectorNumber: "ST07-010_p3",
      cardNumber: "ST07-010",
      set: {
        code: "ST07",
        name: "Store Tournament Winner Pack 03",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-010_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-010_p3.webp?260424",
      productName: "Store Tournament Winner Pack 03",
    },
  ],
  selectedPrintingId: "ST07-010",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-010.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-010.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【Destroyed】If it is your opponent's turn and this is a (CB) Unit, draw 1.",
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
        timing: ["destroyed"],
        conditions: [{ type: "duringPair" }, { type: "selfHasTrait", trait: "cb" }],
      },
      directives: [
        {
          condition: {
            type: "isTurn",
            whose: "opponent",
          },
          thenDirectives: [
            {
              action: {
                action: "draw",
                count: 1,
              },
            },
          ],
        },
      ],
      sourceText: "【Destroyed】If it is your opponent's turn and this is a (CB) Unit, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
