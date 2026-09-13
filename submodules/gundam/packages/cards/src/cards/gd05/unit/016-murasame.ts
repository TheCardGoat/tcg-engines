import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05Murasame016: UnitCard = {
  cardNumber: "GD05-016",
  name: "Murasame",
  type: "unit",
  color: "blue",
  traits: ["orb"],
  id: "GD05-016",
  canonicalId: "GD05-016",
  externalIds: { bandai: "gundam:gd05-016" },
  slug: "murasame-gd05-016",
  displayName: "Murasame",
  rulesText:
    "When one of your (Orb) Units is deployed, this Unit gains <High-Maneuver> during this turn.\n\n(This Unit can't be blocked.)",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-016",
  printings: [
    {
      id: "GD05-016",
      artId: "GD05-016",
      setCode: "GD05",
      collectorNumber: "GD05-016",
      cardNumber: "GD05-016",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-016.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-016",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-016.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED Destiny",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 4,
  battlefieldZones: ["space", "earth"],
  effect:
    "When one of your (Orb) Units is deployed, this Unit gains <High-Maneuver> during this turn.\n\n(This Unit can't be blocked.)",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "orb",
                },
              ],
            },
          },
        ],
      },
      directives: [
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
        "When one of your (Orb) Units is deployed, this Unit gains <High-Maneuver> during this turn. (This Unit can't be blocked.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
