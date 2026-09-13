import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st10KamilleBidan011: PilotCard = {
  cardNumber: "ST10-011",
  name: "Kamille Bidan",
  type: "pilot",
  color: "blue",
  traits: ["g generation", "attack"],
  id: "ST10-011",
  canonicalId: "ST10-011",
  externalIds: { bandai: "gundam:st10-011" },
  slug: "kamille-bidan-st10-011",
  displayName: "Kamille Bidan",
  rulesText:
    "【Burst】Add this card to your hand.\n【When Linked】If 2 or more rested Units are in play, choose 1 enemy Unit whose Lv. is equal to or lower than this Unit. Rest it.",
  set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
  printNumber: "ST10-011",
  printings: [
    {
      id: "ST10-011",
      artId: "ST10-011",
      setCode: "ST10",
      collectorNumber: "ST10-011",
      cardNumber: "ST10-011",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-011.webp",
      productName: "Generation Pulse [ST10]",
    },
    {
      id: "ST10-011-p1",
      artId: "ST10-011_p1",
      setCode: "ST10",
      collectorNumber: "ST10-011-p1",
      cardNumber: "ST10-011",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-011_p1.webp",
      productName: "Generation Pulse [ST10]",
    },
  ],
  selectedPrintingId: "ST10-011",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-011.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【When Linked】If 2 or more rested Units are in play, choose 1 enemy Unit whose Lv. is equal to or lower than this Unit. Rest it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addSelfToHand",
          },
        },
      ],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
        conditions: [
          {
            type: "unitCount",
            owner: "any",
            comparison: "gte",
            count: 2,
            state: "rested",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: {
                    ref: "source",
                    stat: "level",
                  },
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【When Linked】If 2 or more rested Units are in play, choose 1 enemy Unit whose Lv. is equal to or lower than this Unit. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
