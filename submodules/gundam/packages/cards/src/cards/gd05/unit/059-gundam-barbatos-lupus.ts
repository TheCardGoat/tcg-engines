import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05GundamBarbatosLupus059: UnitCard = {
  cardNumber: "GD05-059",
  name: "Gundam Barbatos Lupus",
  type: "unit",
  color: "purple",
  traits: ["tekkadan", "gundam frame"],
  id: "GD05-059",
  canonicalId: "GD05-059",
  externalIds: { bandai: "gundam:gd05-059" },
  slug: "gundam-barbatos-lupus-gd05-059",
  displayName: "Gundam Barbatos Lupus",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-059",
  printings: [
    {
      id: "GD05-059",
      artId: "GD05-059",
      setCode: "GD05",
      collectorNumber: "GD05-059",
      cardNumber: "GD05-059",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-059.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-059.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-059_p1",
      artId: "GD05-059_p1",
      setCode: "GD05",
      collectorNumber: "GD05-059_p1",
      cardNumber: "GD05-059",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-059_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-059_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-059", "GD05-059_p1"],
  selectedPrintingId: "GD05-059",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-059.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-059.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Iron-Blooded Orphans",
  level: 6,
  cost: 4,
  ap: 5,
  hp: 4,
  linkCondition: "[Mikazuki Augus]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Attack】Choose 1 of your active (Gjallarhorn) Units. Rest it. If you do, draw 1. This Unit gains <High-Maneuver> during this turn.\n\n(This Unit can't be blocked.)",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "gjallarhorn",
                },
              ],
              count: 1,
            },
          },
        },
        {
          action: {
            action: "draw",
            count: 1,
          },
          dependsOnPrevious: true,
        },
        {
          action: {
            action: "grantKeyword",
            keyword: "HighManeuver",
            duration: "thisTurn",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【Attack】Choose 1 of your active (Gjallarhorn) Units. Rest it. If you do, draw 1. This Unit gains <High-Maneuver> during this turn. (This Unit can't be blocked.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
