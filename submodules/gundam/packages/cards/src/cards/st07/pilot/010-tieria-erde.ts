import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st07TieriaErde010: PilotCard = {
  cardNumber: "ST07-010",
  name: "Tieria Erde",
  type: "pilot",
  color: "purple",
  traits: ["cb", "innovade"],
  id: "ST07-010",
  canonicalId: "ST07-010",
  externalIds: { bandai: "gundam:st07-010" },
  slug: "tieria-erde/st07-010",
  displayName: "Tieria Erde",
  set: { code: "ST07", name: "Celestial Drive [ST07]", packageId: "616007" },
  printNumber: "ST07-010",
  printings: [
    {
      id: "ST07-010",
      artId: "ST07-010",
      setCode: "ST07",
      collectorNumber: "ST07-010",
      cardNumber: "ST07-010",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07]",
        packageId: "616007",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st07/ST07-010.webp",
      productName: "Celestial Drive [ST07]",
    },
    {
      id: "ST07-010_p1",
      artId: "ST07-010_p1",
      setCode: "ST07",
      collectorNumber: "ST07-010_p1",
      cardNumber: "ST07-010",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07] Bonus Pack",
        packageId: "616007",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st07/ST07-010_p1.webp",
      productName: "Celestial Drive [ST07] Bonus Pack",
    },
    {
      id: "ST07-010_p2",
      artId: "ST07-010_p2",
      setCode: "ST07",
      collectorNumber: "ST07-010_p2",
      cardNumber: "ST07-010",
      set: {
        code: "ST07",
        name: "Store Tournament Participant Pack 03",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st07/ST07-010_p2.webp",
      productName: "Store Tournament Participant Pack 03",
    },
    {
      id: "ST07-010_p3",
      artId: "ST07-010_p3",
      setCode: "ST07",
      collectorNumber: "ST07-010_p3",
      cardNumber: "ST07-010",
      set: {
        code: "ST07",
        name: "Store Tournament Winner Pack 03",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st07/ST07-010_p3.webp",
      productName: "Store Tournament Winner Pack 03",
    },
  ],
  reprints: ["ST07-010", "ST07-010_p1", "ST07-010_p2", "ST07-010_p3"],
  selectedPrintingId: "ST07-010",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/st07/ST07-010.webp",
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
