import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01Tallgeese025: UnitCard = {
  cardNumber: "EB01-025",
  name: "Tallgeese Ⅱ",
  type: "unit",
  color: "green",
  traits: ["g generation"],
  id: "EB01-025",
  canonicalId: "EB01-025",
  externalIds: { bandai: "gundam:eb01-025" },
  slug: "tallgeese-eb01-025",
  displayName: "Tallgeese Ⅱ",
  rulesText:
    "【Deploy・Development 2】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect:\n\n■All players place 1 EX Resource.\n【During Pair】While your opponent has an EX Resource, this Unit can't receive battle damage from enemy Units that are Lv.5 or lower.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-025",
  printings: [
    {
      id: "EB01-025",
      artId: "EB01-025",
      setCode: "EB01",
      collectorNumber: "EB01-025",
      cardNumber: "EB01-025",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-025.webp",
      productName: "Eternal Nexus [EB01]",
    },
    {
      id: "EB01-025-p1",
      artId: "EB01-025_p1",
      setCode: "EB01",
      collectorNumber: "EB01-025-p1",
      cardNumber: "EB01-025",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-025_p1.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-025",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-025.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 6,
  cost: 5,
  ap: 5,
  hp: 4,
  linkCondition: "(G Generation) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Deploy・Development 2】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect:\n\n■All players place 1 EX Resource.\n【During Pair】While your opponent has an EX Resource, this Unit can't receive battle damage from enemy Units that are Lv.5 or lower.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "exile",
            target: {
              owner: "friendly",
              zone: "trash",
              count: 2,
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
            action: "placeExResource",
            state: "active",
            recipients: "all",
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Deploy·Development 2】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect: ■All players place 1 EX Resource.",
    },
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "duringPair",
          },
          {
            type: "cardInZone",
            owner: "opponent",
            zone: "resourceArea",
            cardType: "resource",
            hasName: "EX Resource",
            comparison: "gte",
            count: 1,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "preventDamage",
            target: {
              owner: "self",
            },
            unitFilter: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
            damageType: "battle",
            duration: "permanent",
          },
        },
      ],
      sourceText:
        "【During Pair】While your opponent has an EX Resource, this Unit can't receive battle damage from enemy Units that are Lv.5 or lower.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
