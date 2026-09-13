import type { CardEffect, ResourceCard } from "@tcg/gundam-types";

export const exrExResource003: ResourceCard = {
  cardNumber: "EXR-003",
  name: "EX Resource",
  type: "resource",
  traits: [],
  id: "EXR-003",
  canonicalId: "EXR-003",
  externalIds: { bandai: "gundam:exr-003" },
  slug: "ex-resource-exr-003",
  displayName: "EX Resource",
  rulesText:
    "(At the start of the game, the second-turn player places 1 active EX Resource into their resource area.)\n(Rest an EX Resource then exile it from the game when paying a cost.)",
  set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
  printNumber: "EXR-003",
  printings: [
    {
      id: "EXR-003",
      artId: "EXR-003",
      setCode: "ST10",
      collectorNumber: "EXR-003",
      cardNumber: "EXR-003",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/exr/EXR-003.webp",
      productName: "Generation Pulse [ST10]",
    },
  ],
  selectedPrintingId: "EXR-003",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/exr/EXR-003.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 0,
  cost: 0,
  effect:
    "(At the start of the game, the second-turn player places 1 active EX Resource into their resource area.)\n(Rest an EX Resource then exile it from the game when paying a cost.)",
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "unparsedText",
            text: "(At the start of the game, the second-turn player places 1 active EX Resource into their resource area.) (Rest an EX Resource then exile it from the game when paying a cost.)",
          },
        },
      ],
      sourceText:
        "(At the start of the game, the second-turn player places 1 active EX Resource into their resource area.) (Rest an EX Resource then exile it from the game when paying a cost.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
export const st10ExResource003 = exrExResource003;
