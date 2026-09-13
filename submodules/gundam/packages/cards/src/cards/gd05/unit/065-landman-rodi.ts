import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05LandmanRodi065: UnitCard = {
  cardNumber: "GD05-065",
  name: "Landman Rodi",
  type: "unit",
  color: "purple",
  traits: ["tekkadan"],
  id: "GD05-065",
  canonicalId: "GD05-065",
  externalIds: { bandai: "gundam:gd05-065" },
  slug: "landman-rodi-gd05-065",
  displayName: "Landman Rodi",
  rulesText: "【During Link】This Unit gets AP+2 during your turn.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-065",
  printings: [
    {
      id: "GD05-065",
      artId: "GD05-065",
      setCode: "GD05",
      collectorNumber: "GD05-065",
      cardNumber: "GD05-065",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-065.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-065",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-065.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Iron-Blooded Orphans",
  level: 2,
  cost: 2,
  ap: 1,
  hp: 2,
  linkCondition: "(Tekkadan) Trait",
  battlefieldZones: ["space", "earth"],
  effect: "【During Link】This Unit gets AP+2 during your turn.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "duringLink",
          },
          {
            type: "isTurn",
            whose: "friendly",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText: "【During Link】This Unit gets AP+2 during your turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
