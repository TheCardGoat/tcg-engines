import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01GundamPixy019: UnitCard = {
  cardNumber: "EB01-019",
  name: "Gundam Pixy",
  type: "unit",
  color: "blue",
  traits: ["g generation"],
  id: "EB01-019",
  canonicalId: "EB01-019",
  externalIds: { bandai: "gundam:eb01-019" },
  slug: "gundam-pixy-eb01-019",
  displayName: "Gundam Pixy",
  rulesText:
    "【Attack】If there are 2 or more other rested Units in play, this Unit gains <High-Maneuver> during this battle.\n\n(This Unit can't be blocked.)",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-019",
  printings: [
    {
      id: "EB01-019",
      artId: "EB01-019",
      setCode: "EB01",
      collectorNumber: "EB01-019",
      cardNumber: "EB01-019",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-019.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-019",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-019.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 3,
  ap: 2,
  hp: 4,
  linkCondition: "(G Generation) Trait",
  battlefieldZones: ["earth"],
  effect:
    "【Attack】If there are 2 or more other rested Units in play, this Unit gains <High-Maneuver> during this battle.\n\n(This Unit can't be blocked.)",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "any",
            comparison: "gte",
            count: 2,
            state: "rested",
            excludeSelf: true,
          },
          thenDirectives: [
            {
              action: {
                action: "grantKeyword",
                keyword: "HighManeuver",
                duration: "thisBattle",
                target: {
                  owner: "self",
                  cardType: "unit",
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Attack】If there are 2 or more other rested Units in play, this Unit gains <High-Maneuver> during this battle. (This Unit can't be blocked.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
