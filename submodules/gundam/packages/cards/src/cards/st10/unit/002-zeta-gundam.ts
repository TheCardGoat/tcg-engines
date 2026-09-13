import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st10ZetaGundam002: UnitCard = {
  cardNumber: "ST10-002",
  name: "Zeta Gundam",
  type: "unit",
  color: "blue",
  traits: ["g generation"],
  id: "ST10-002",
  canonicalId: "ST10-002",
  externalIds: { bandai: "gundam:st10-002" },
  slug: "zeta-gundam-st10-002",
  displayName: "Zeta Gundam",
  rulesText:
    "【Deploy・Development 2】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect:\n\r\n■Choose 1 enemy Unit with 4 or less HP. Rest it.",
  set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
  printNumber: "ST10-002",
  printings: [
    {
      id: "ST10-002",
      artId: "ST10-002",
      setCode: "ST10",
      collectorNumber: "ST10-002",
      cardNumber: "ST10-002",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-002.webp",
      productName: "Generation Pulse [ST10]",
    },
    {
      id: "ST10-002-p1",
      artId: "ST10-002_p1",
      setCode: "ST10",
      collectorNumber: "ST10-002-p1",
      cardNumber: "ST10-002",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-002_p1.webp",
      productName: "Generation Pulse [ST10]",
    },
  ],
  selectedPrintingId: "ST10-002",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-002.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "(Support) Trait / [Kamille Bidan]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Deploy・Development 2】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect:\n\r\n■Choose 1 enemy Unit with 4 or less HP. Rest it.",
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
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "hp",
                  comparison: "lte",
                  value: 4,
                },
              ],
              count: 1,
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Deploy·Development 2】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect: ■Choose 1 enemy Unit with 4 or less HP. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
