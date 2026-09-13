import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05ChaosGundam039: UnitCard = {
  cardNumber: "GD05-039",
  name: "Chaos Gundam",
  type: "unit",
  color: "red",
  traits: ["earth alliance", "phantom pain"],
  id: "GD05-039",
  canonicalId: "GD05-039",
  externalIds: { bandai: "gundam:gd05-039" },
  slug: "chaos-gundam-gd05-039",
  displayName: "Chaos Gundam",
  rulesText:
    "【Attack】Choose 1 of your (Phantom Pain) Linked Units. It gains <High-Maneuver> during this turn.\n\n(This Unit can't be blocked.)",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-039",
  printings: [
    {
      id: "GD05-039",
      artId: "GD05-039",
      setCode: "GD05",
      collectorNumber: "GD05-039",
      cardNumber: "GD05-039",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-039.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-039",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-039.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED Destiny",
  level: 3,
  cost: 2,
  ap: 4,
  hp: 2,
  linkCondition: "[Sting Oakley]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Attack】Choose 1 of your (Phantom Pain) Linked Units. It gains <High-Maneuver> during this turn.\n\n(This Unit can't be blocked.)",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "HighManeuver",
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "phantom pain",
                },
              ],
              isLinkUnit: true,
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Attack】Choose 1 of your (Phantom Pain) Linked Units. It gains <High-Maneuver> during this turn. (This Unit can't be blocked.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
