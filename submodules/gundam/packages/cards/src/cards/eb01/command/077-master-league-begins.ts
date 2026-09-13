import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const eb01MasterLeagueBegins077: CommandCard = {
  cardNumber: "EB01-077",
  name: "Master League Begins",
  type: "command",
  color: "green",
  traits: [],
  id: "EB01-077",
  canonicalId: "EB01-077",
  externalIds: { bandai: "gundam:eb01-077" },
  slug: "master-league-begins-eb01-077",
  displayName: "Master League Begins",
  rulesText:
    "【Burst】Add this card to your hand.\n【Action】Choose 1 rested friendly (G Generation) Unit. Change a battling enemy Unit's attack target to it.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-077",
  printings: [
    {
      id: "EB01-077",
      artId: "EB01-077",
      setCode: "EB01",
      collectorNumber: "EB01-077",
      cardNumber: "EB01-077",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-077.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-077",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-077.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 1,
  effect:
    "【Burst】Add this card to your hand.\n【Action】Choose 1 rested friendly (G Generation) Unit. Change a battling enemy Unit's attack target to it.",
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
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "changeAttackTarget",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "rested",
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "g generation" },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Action】Choose 1 rested friendly (G Generation) Unit. Change a battling enemy Unit's attack target to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
