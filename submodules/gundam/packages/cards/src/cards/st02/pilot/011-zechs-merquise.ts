import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st02ZechsMerquise011: PilotCard = {
  cardNumber: "ST02-011",
  name: "Zechs Merquise",
  type: "pilot",
  color: "blue",
  traits: ["oz"],
  id: "ST02-011",
  canonicalId: "ST02-011",
  externalIds: { bandai: "gundam:st02-011" },
  slug: "zechs-merquise/st02-011",
  displayName: "Zechs Merquise",
  set: { code: "ST02", name: "Wings of Advance [ST02]", packageId: "616002" },
  printNumber: "ST02-011",
  printings: [
    {
      id: "ST02-011",
      artId: "ST02-011",
      setCode: "ST02",
      collectorNumber: "ST02-011",
      cardNumber: "ST02-011",
      set: {
        code: "ST02",
        name: "Wings of Advance [ST02]",
        packageId: "616002",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st02/ST02-011.webp",
      productName: "Wings of Advance [ST02]",
    },
    {
      id: "ST02-011_p1",
      artId: "ST02-011_p1",
      setCode: "ST02",
      collectorNumber: "ST02-011_p1",
      cardNumber: "ST02-011",
      set: {
        code: "ST02",
        name: "Wings of Advance [ST02] Bonus Pack",
        packageId: "616002",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st02/ST02-011_p1.webp",
      productName: "Wings of Advance [ST02] Bonus Pack",
    },
    {
      id: "ST02-011_p2",
      artId: "ST02-011_p2",
      setCode: "ST02",
      collectorNumber: "ST02-011_p2",
      cardNumber: "ST02-011",
      set: {
        code: "ST02",
        name: "Championship Participation Pack 01",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st02/ST02-011_p2.webp",
      productName: "Championship Participation Pack 01",
    },
  ],
  reprints: ["ST02-011", "ST02-011_p1", "ST02-011_p2"],
  selectedPrintingId: "ST02-011",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/st02/ST02-011.webp",
  legality: "legal",
  level: 5,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【During Link】During your turn, when this Unit destroys an enemy Unit with battle damage, draw 1.<br>",
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
        conditions: [
          { type: "duringLink" },
          { type: "isTurn", whose: "friendly" },
          { type: "eventCardIsSelf" },
        ],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
      ],
      sourceText:
        "【During Link】During your turn, when this Unit destroys an enemy Unit with battle damage, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
