import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd01ThePathToVictoryOrDefeat109: CommandCard = {
  cardNumber: "GD01-109",
  name: "The Path to Victory or Defeat",
  type: "command",
  color: "green",
  traits: ["-"],
  id: "GD01-109",
  externalId: "gundam:gd01-109",
  slug: "the-path-to-victory-or-defeat-gd01-109",
  displayName: "The Path to Victory or Defeat",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-109",
  printings: [
    {
      id: "GD01-109",
      collectorNumber: "GD01-109",
      cardNumber: "GD01-109",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-109.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-109.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-109",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-109.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-109.webp?260424",
  legality: "legal",
  level: 5,
  cost: 1,
  effect:
    "【Main】Look at the top 5 cards of your deck. You may reveal 1 (Operation Meteor)/(G Team) Unit card/Pilot card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "lookAtTopDeck",
            count: 5,
            return: "chooseTop",
            tutorFilter: {
              owner: "friendly",
              cardType: ["unit", "pilot"],
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    { attribute: "trait", comparison: "includes", value: "operation meteor" },
                    { attribute: "trait", comparison: "includes", value: "g team" },
                  ],
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Main】Look at the top 5 cards of your deck. You may reveal 1 (Operation Meteor)/(G Team) Unit card/Pilot card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
