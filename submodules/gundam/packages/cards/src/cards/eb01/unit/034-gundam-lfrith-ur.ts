import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01GundamLfrithUr034: UnitCard = {
  cardNumber: "EB01-034",
  name: "Gundam Lfrith Ur",
  type: "unit",
  color: "green",
  traits: ["g generation"],
  id: "EB01-034",
  canonicalId: "EB01-034",
  externalIds: { bandai: "gundam:eb01-034" },
  slug: "gundam-lfrith-ur-eb01-034",
  displayName: "Gundam Lfrith Ur",
  rulesText:
    "【When Linked】Look at the top 3 cards of your deck. You may reveal 1 (G Generation) Unit card that is Lv.3 among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-034",
  printings: [
    {
      id: "EB01-034",
      artId: "EB01-034",
      setCode: "EB01",
      collectorNumber: "EB01-034",
      cardNumber: "EB01-034",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-034.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-034",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-034.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 2,
  linkCondition: "(G Generation) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "【When Linked】Look at the top 3 cards of your deck. You may reveal 1 (G Generation) Unit card that is Lv.3 among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
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
        "【When Linked】Look at the top 3 cards of your deck. You may reveal 1 (G Generation) Unit card that is Lv.3 among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
