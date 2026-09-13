import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01GSelf038: UnitCard = {
  cardNumber: "EB01-038",
  name: "G-Self",
  type: "unit",
  color: "green",
  traits: ["g generation"],
  id: "EB01-038",
  canonicalId: "EB01-038",
  externalIds: { bandai: "gundam:eb01-038" },
  slug: "g-self-eb01-038",
  displayName: "G-Self",
  rulesText: "【Deploy】Place 1 EX Resource.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-038",
  printings: [
    {
      id: "EB01-038",
      artId: "EB01-038",
      setCode: "EB01",
      collectorNumber: "EB01-038",
      cardNumber: "EB01-038",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-038.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-038",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-038.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 2,
  battlefieldZones: ["space", "earth"],
  effect: "【Deploy】Place 1 EX Resource.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "placeExResource",
            state: "active",
          },
        },
      ],
      sourceText: "【Deploy】Place 1 EX Resource.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
