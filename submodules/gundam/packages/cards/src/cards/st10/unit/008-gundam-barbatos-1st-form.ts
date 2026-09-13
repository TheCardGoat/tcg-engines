import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st10GundamBarbatos1stForm008: UnitCard = {
  cardNumber: "ST10-008",
  name: "Gundam Barbatos 1st Form",
  type: "unit",
  color: "white",
  traits: ["g generation"],
  id: "ST10-008",
  canonicalId: "ST10-008",
  externalIds: { bandai: "gundam:st10-008" },
  slug: "gundam-barbatos-1st-form-st10-008",
  displayName: "Gundam Barbatos 1st Form",
  rulesText:
    "【Deploy・Development 2】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect:\n\r\n■Draw a number of cards equal to the number of enemy players. Then, discard the same number of cards you drew with this effect.",
  set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
  printNumber: "ST10-008",
  printings: [
    {
      id: "ST10-008",
      artId: "ST10-008",
      setCode: "ST10",
      collectorNumber: "ST10-008",
      cardNumber: "ST10-008",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-008.webp",
      productName: "Generation Pulse [ST10]",
    },
    {
      id: "ST10-008-p1",
      artId: "ST10-008_p1",
      setCode: "ST10",
      collectorNumber: "ST10-008-p1",
      cardNumber: "ST10-008",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-008_p1.webp",
      productName: "Generation Pulse [ST10]",
    },
  ],
  selectedPrintingId: "ST10-008",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-008.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  linkCondition: "(G Generation) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Deploy・Development 2】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect:\n\r\n■Draw a number of cards equal to the number of enemy players. Then, discard the same number of cards you drew with this effect.",
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
            action: "drawThenDiscardByOpponentCount",
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Deploy·Development 2】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect: ■Draw a number of cards equal to the number of enemy players. Then, discard the same number of cards you drew with this effect.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
