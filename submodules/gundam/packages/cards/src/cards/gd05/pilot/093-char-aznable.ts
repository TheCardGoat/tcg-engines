import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd05CharAznable093: PilotCard = {
  cardNumber: "GD05-093",
  name: "Char Aznable",
  type: "pilot",
  color: "purple",
  traits: ["neo zeon", "newtype"],
  id: "GD05-093",
  canonicalId: "GD05-093",
  externalIds: { bandai: "gundam:gd05-093" },
  slug: "char-aznable-gd05-093",
  displayName: "Char Aznable",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-093",
  printings: [
    {
      id: "GD05-093",
      artId: "GD05-093",
      setCode: "GD05",
      collectorNumber: "GD05-093",
      cardNumber: "GD05-093",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-093.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-093.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-093_p1",
      artId: "GD05-093_p1",
      setCode: "GD05",
      collectorNumber: "GD05-093_p1",
      cardNumber: "GD05-093",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-093_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-093_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-093", "GD05-093_p1"],
  selectedPrintingId: "GD05-093",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-093.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-093.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 5,
  cost: 1,
  apBonus: 2,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\n【When Linked】You may choose 1 (Neo Zeon) Base card from your trash. Deploy it.",
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
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "deploy",
            target: {
              owner: "friendly",
              cardType: "base",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "neo zeon",
                },
              ],
              zone: "trash",
              count: 1,
            },
          },
          optional: true,
        },
      ],
      sourceText:
        "【When Linked】You may choose 1 (Neo Zeon) Base card from your trash. Deploy it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
