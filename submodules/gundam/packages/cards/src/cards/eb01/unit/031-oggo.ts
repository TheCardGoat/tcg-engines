import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01Oggo031: UnitCard = {
  cardNumber: "EB01-031",
  name: "Oggo",
  type: "unit",
  color: "green",
  traits: ["g generation"],
  id: "EB01-031",
  canonicalId: "EB01-031",
  externalIds: { bandai: "gundam:eb01-031" },
  slug: "oggo-eb01-031",
  displayName: "Oggo",
  rulesText:
    "This Unit may choose an active enemy Unit that is Lv.3 or lower as its attack target.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-031",
  printings: [
    {
      id: "EB01-031",
      artId: "EB01-031",
      setCode: "EB01",
      collectorNumber: "EB01-031",
      cardNumber: "EB01-031",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-031.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-031",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-031.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 1,
  ap: 1,
  hp: 2,
  battlefieldZones: ["space"],
  effect: "This Unit may choose an active enemy Unit that is Lv.3 or lower as its attack target.",
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "self",
              cardType: "unit",
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
            duration: "permanent",
          },
        },
      ],
      sourceText:
        "This Unit may choose an active enemy Unit that is Lv.3 or lower as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
