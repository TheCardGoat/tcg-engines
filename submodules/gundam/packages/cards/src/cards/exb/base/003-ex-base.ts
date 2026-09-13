import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const exbExBase003: BaseCard = {
  cardNumber: "EXB-003",
  name: "EX Base",
  type: "base",
  traits: [],
  id: "EXB-003",
  canonicalId: "EXB-003",
  externalIds: { bandai: "gundam:exb-003" },
  slug: "ex-base-exb-003",
  displayName: "EX Base",
  rulesText: "(At the start of the game, place 1 active EX Base as your shield area's base.)",
  set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
  printNumber: "EXB-003",
  printings: [
    {
      id: "EXB-003",
      artId: "EXB-003",
      setCode: "ST10",
      collectorNumber: "EXB-003",
      cardNumber: "EXB-003",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/exb/EXB-003.webp",
      productName: "Generation Pulse [ST10]",
    },
  ],
  selectedPrintingId: "EXB-003",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/exb/EXB-003.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 0,
  cost: 0,
  hp: 3,
  effect: "(At the start of the game, place 1 active EX Base as your shield area's base.)",
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "unparsedText",
            text: "(At the start of the game, place 1 active EX Base as your shield area's base.)",
          },
        },
      ],
      sourceText: "(At the start of the game, place 1 active EX Base as your shield area's base.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
export const st10ExBase003 = exbExBase003;
