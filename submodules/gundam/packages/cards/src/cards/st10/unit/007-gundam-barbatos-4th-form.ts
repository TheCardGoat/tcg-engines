import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st10GundamBarbatos4thForm007: UnitCard = {
  cardNumber: "ST10-007",
  name: "Gundam Barbatos 4th Form",
  type: "unit",
  color: "white",
  traits: ["g generation"],
  id: "ST10-007",
  canonicalId: "ST10-007",
  externalIds: { bandai: "gundam:st10-007" },
  slug: "gundam-barbatos-4th-form-st10-007",
  displayName: "Gundam Barbatos 4th Form",
  rulesText:
    "【When Linked・Development 2】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect:\n\r\n■Choose 1 Command card that is Lv.4 or lower from your trash. Add it to your hand.",
  set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
  printNumber: "ST10-007",
  printings: [
    {
      id: "ST10-007",
      artId: "ST10-007",
      setCode: "ST10",
      collectorNumber: "ST10-007",
      cardNumber: "ST10-007",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-007.webp",
      productName: "Generation Pulse [ST10]",
    },
    {
      id: "ST10-007-p1",
      artId: "ST10-007_p1",
      setCode: "ST10",
      collectorNumber: "ST10-007-p1",
      cardNumber: "ST10-007",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-007_p1.webp",
      productName: "Generation Pulse [ST10]",
    },
  ],
  selectedPrintingId: "ST10-007",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-007.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 6,
  cost: 5,
  ap: 4,
  hp: 5,
  linkCondition: "(G Generation) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "【When Linked・Development 2】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect:\n\r\n■Choose 1 Command card that is Lv.4 or lower from your trash. Add it to your hand.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
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
            action: "addFromTrash",
            target: {
              owner: "friendly",
              cardType: "command",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 4,
                },
              ],
              zone: "trash",
              count: 1,
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【When Linked·Development 2】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect: ■Choose 1 Command card that is Lv.4 or lower from your trash. Add it to your hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
