import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const eb01PremiumUnitAssembly078: CommandCard = {
  cardNumber: "EB01-078",
  name: "Premium Unit Assembly",
  type: "command",
  color: "green",
  traits: [],
  id: "EB01-078",
  canonicalId: "EB01-078",
  externalIds: { bandai: "gundam:eb01-078" },
  slug: "premium-unit-assembly-eb01-078",
  displayName: "Premium Unit Assembly",
  rulesText:
    "【Main】All players each look at the top card of their deck. If it is a Unit card, they may reveal it and add it to their hand. They return any remaining card to the top or bottom of their deck.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-078",
  printings: [
    {
      id: "EB01-078",
      artId: "EB01-078",
      setCode: "EB01",
      collectorNumber: "EB01-078",
      cardNumber: "EB01-078",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-078.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-078",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-078.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 1,
  cost: 1,
  effect:
    "【Main】All players each look at the top card of their deck. If it is a Unit card, they may reveal it and add it to their hand. They return any remaining card to the top or bottom of their deck.",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "queueEffectForPlayers",
            scope: "all",
            effect: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  action: {
                    action: "lookAtTopDeck",
                    count: 1,
                    return: "chooseTop",
                    tutorFilter: { owner: "friendly", count: 1, cardType: "unit" },
                  },
                },
              ],
              sourceText:
                "Look at the top card of your deck. You may reveal it and add it to your hand. Return it to the top or bottom of your deck.",
            },
          },
        },
      ],
      sourceText:
        "【Main】All players each look at the top card of their deck. If it is a Unit card, they may reveal it and add it to their hand. They return any remaining card to the top or bottom of their deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
