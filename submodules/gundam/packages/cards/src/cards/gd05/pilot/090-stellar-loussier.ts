import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd05StellarLoussier090: PilotCard = {
  cardNumber: "GD05-090",
  name: "Stellar Loussier",
  type: "pilot",
  color: "red",
  traits: ["earth alliance", "phantom pain", "biological cpu"],
  id: "GD05-090",
  canonicalId: "GD05-090",
  externalIds: { bandai: "gundam:gd05-090" },
  slug: "stellar-loussier-gd05-090",
  displayName: "Stellar Loussier",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-090",
  printings: [
    {
      id: "GD05-090",
      artId: "GD05-090",
      setCode: "GD05",
      collectorNumber: "GD05-090",
      cardNumber: "GD05-090",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-090.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-090.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-090_p1",
      artId: "GD05-090_p1",
      setCode: "GD05",
      collectorNumber: "GD05-090_p1",
      cardNumber: "GD05-090",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-090_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-090_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-090", "GD05-090_p1"],
  selectedPrintingId: "GD05-090",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-090.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-090.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED Destiny",
  level: 3,
  cost: 1,
  apBonus: 2,
  hpBonus: 0,
  effect:
    "【Burst】Add this card to your hand.\n【Destroyed】Look at the top card of your deck. If it is a (Phantom Pain) card, you may reveal it and add it to your hand. Return any remaining card to the bottom of your deck.",
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
      },
      directives: [
        {
          action: {
            action: "lookAtTopDeck",
            count: 1,
            return: "chooseTop",
            tutorFilter: {
              owner: "friendly",
              count: 1,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "phantom pain",
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Destroyed】Look at the top card of your deck. If it is a (Phantom Pain) card, you may reveal it and add it to your hand. Return any remaining card to the bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
