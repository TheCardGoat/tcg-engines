import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05ReGz019: UnitCard = {
  cardNumber: "GD05-019",
  name: "Re-GZ",
  type: "unit",
  color: "green",
  traits: ["earth federation", "londo bell"],
  id: "GD05-019",
  canonicalId: "GD05-019",
  externalIds: { bandai: "gundam:gd05-019" },
  slug: "re-gz-gd05-019",
  displayName: "Re-GZ",
  rulesText:
    "【Destroyed】Look at the top 3 cards of your deck. You may reveal 1 (Londo Bell) Unit card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-019",
  printings: [
    {
      id: "GD05-019",
      artId: "GD05-019",
      setCode: "GD05",
      collectorNumber: "GD05-019",
      cardNumber: "GD05-019",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-019.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-019",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-019.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 2,
  linkCondition: "(Londo Bell) Trait / [Amuro Ray]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Destroyed】Look at the top 3 cards of your deck. You may reveal 1 (Londo Bell) Unit card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
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
                  value: "londo bell",
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Destroyed】Look at the top 3 cards of your deck. You may reveal 1 (Londo Bell) Unit card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
