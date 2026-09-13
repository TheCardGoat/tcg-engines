import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01GoufVijayanta014: UnitCard = {
  cardNumber: "EB01-014",
  name: "Gouf Vijayanta",
  type: "unit",
  color: "blue",
  traits: ["g generation"],
  id: "EB01-014",
  canonicalId: "EB01-014",
  externalIds: { bandai: "gundam:eb01-014" },
  slug: "gouf-vijayanta-eb01-014",
  displayName: "Gouf Vijayanta",
  rulesText:
    "During your opponent's turn, this Unit can't receive effect damage from enemy Units that are Lv.5 or lower.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-014",
  printings: [
    {
      id: "EB01-014",
      artId: "EB01-014",
      setCode: "EB01",
      collectorNumber: "EB01-014",
      cardNumber: "EB01-014",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-014.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-014",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-014.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 3,
  battlefieldZones: ["earth"],
  effect:
    "During your opponent's turn, this Unit can't receive effect damage from enemy Units that are Lv.5 or lower.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "isTurn",
            whose: "opponent",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "preventDamage",
            target: { owner: "self", cardType: "unit" },
            unitFilter: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 5 }],
            },
            damageType: "effect",
            source: "enemy",
            duration: "permanent",
          },
        },
      ],
      sourceText:
        "During your opponent's turn, this Unit can't receive effect damage from enemy Units that are Lv.5 or lower.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
