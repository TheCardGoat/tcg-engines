import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01BigRang030: UnitCard = {
  cardNumber: "EB01-030",
  name: "Big-Rang",
  type: "unit",
  color: "green",
  traits: ["g generation"],
  id: "EB01-030",
  canonicalId: "EB01-030",
  externalIds: { bandai: "gundam:eb01-030" },
  slug: "big-rang-eb01-030",
  displayName: "Big-Rang",
  rulesText:
    "【Deploy】Look at the top 3 cards of your deck. You may reveal 1 (G Generation) Unit card that is Lv.3 among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-030",
  printings: [
    {
      id: "EB01-030",
      artId: "EB01-030",
      setCode: "EB01",
      collectorNumber: "EB01-030",
      cardNumber: "EB01-030",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-030.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-030",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-030.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 5,
  cost: 4,
  ap: 5,
  hp: 3,
  battlefieldZones: ["space"],
  effect:
    "【Deploy】Look at the top 3 cards of your deck. You may reveal 1 (G Generation) Unit card that is Lv.3 among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "lookAtTopDeck",
            count: 3,
            return: "chooseTop",
            randomizeRemainingToBottom: true,
            tutorFilter: {
              owner: "friendly",
              count: 1,
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "g generation",
                },
                {
                  attribute: "level",
                  comparison: "eq",
                  value: 3,
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Look at the top 3 cards of your deck. You may reveal 1 (G Generation) Unit card that is Lv.3 among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
