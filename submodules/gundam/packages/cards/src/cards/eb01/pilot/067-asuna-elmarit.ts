import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const eb01AsunaElmarit067: PilotCard = {
  cardNumber: "EB01-067",
  name: "Asuna Elmarit",
  type: "pilot",
  color: "green",
  traits: ["g generation", "support"],
  id: "EB01-067",
  canonicalId: "EB01-067",
  externalIds: { bandai: "gundam:eb01-067" },
  slug: "asuna-elmarit-eb01-067",
  displayName: "Asuna Elmarit",
  rulesText:
    "【Burst】Add this card to your hand.\n【When Paired】Look at the top 3 cards of your deck. You may reveal 1 (G Generation) Unit card among them and return it to the top of your deck. Return the remaining cards randomly to the bottom of your deck.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-067",
  printings: [
    {
      id: "EB01-067",
      artId: "EB01-067",
      setCode: "EB01",
      collectorNumber: "EB01-067",
      cardNumber: "EB01-067",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-067.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-067",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-067.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\n【When Paired】Look at the top 3 cards of your deck. You may reveal 1 (G Generation) Unit card among them and return it to the top of your deck. Return the remaining cards randomly to the bottom of your deck.",
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
        timing: ["whenPaired"],
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
                { attribute: "trait", comparison: "includes", value: "g generation" },
              ],
            },
            tutorDestination: "deckTop",
          },
        },
      ],
      sourceText:
        "【When Paired】Look at the top 3 cards of your deck. You may reveal 1 (G Generation) Unit card among them and return it to the top of your deck. Return the remaining cards randomly to the bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
