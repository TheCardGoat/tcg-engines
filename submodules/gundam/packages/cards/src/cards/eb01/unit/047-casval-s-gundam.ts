import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01CasvalSGundam047: UnitCard = {
  cardNumber: "EB01-047",
  name: "Casval's Gundam",
  type: "unit",
  color: "white",
  traits: ["g generation"],
  id: "EB01-047",
  canonicalId: "EB01-047",
  externalIds: { bandai: "gundam:eb01-047" },
  slug: "casval-s-gundam-eb01-047",
  displayName: "Casval's Gundam",
  rulesText:
    "【When Paired・Development 1】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect:\n\n■This Unit gains <High-Maneuver> during this turn.\n\n(This Unit can't be blocked.)",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-047",
  printings: [
    {
      id: "EB01-047",
      artId: "EB01-047",
      setCode: "EB01",
      collectorNumber: "EB01-047",
      cardNumber: "EB01-047",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-047.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-047",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-047.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 4,
  linkCondition: "(G Generation) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "【When Paired・Development 1】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect:\n\n■This Unit gains <High-Maneuver> during this turn.\n\n(This Unit can't be blocked.)",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
      },
      directives: [
        {
          action: {
            action: "exile",
            target: {
              owner: "friendly",
              zone: "trash",
              count: 1,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "g generation",
                },
              ],
            },
          },
          optional: true,
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
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【When Paired·Development 1】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect: ■This Unit gains <High-Maneuver> during this turn. (This Unit can't be blocked.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
