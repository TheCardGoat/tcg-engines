import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GundamAerialRebuild024: UnitCard = {
  cardNumber: "GD04-024",
  name: "Gundam Aerial Rebuild",
  type: "unit",
  color: "green",
  traits: ["academy"],
  id: "GD04-024",
  externalId: "gundam:gd04-024",
  slug: "gundam-aerial-rebuild-gd04-024",
  displayName: "Gundam Aerial Rebuild",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-024",
  printings: [
    {
      id: "GD04-024",
      collectorNumber: "GD04-024",
      cardNumber: "GD04-024",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-024.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-024.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-024_p1",
      collectorNumber: "GD04-024_p1",
      cardNumber: "GD04-024",
      set: {
        code: "GD04",
        name: "Booster Pack Phantom Aria [GD04] Release Event Commemorative Items for Participants",
        packageId: "616901",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-024_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-024_p1.webp?260424",
      productName:
        "Booster Pack Phantom Aria [GD04] Release Event Commemorative Items for Participants",
    },
  ],
  selectedPrintingId: "GD04-024",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-024.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-024.webp?260424",
  legality: "legal",
  level: 7,
  cost: 5,
  ap: 5,
  hp: 5,
  linkCondition: "[Suletta Mercury]",
  effect:
    "【Deploy】Look at the top 3 cards of your deck. You may reveal 1 (Academy) Unit card/Command card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          // NOTE: Printed text says "You may reveal 1 (Academy) Unit
          // card/Command card and add it to your hand". The engine's
          // `lookAtTopDeck` handler always tutors `matches[0]` when the
          // filter matches — see Encounter (GD04-105) for the same
          // trade-off. The filter restricts to Unit/Command cards so
          // (Academy) Pilots in the top 3 are deliberately ignored
          // (rule: card text only allows Unit / Command).
          action: {
            action: "lookAtTopDeck",
            count: 3,
            return: "chooseTop",
            tutorFilter: {
              owner: "friendly",
              cardType: ["unit", "command"],
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "academy",
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Look at the top 3 cards of your deck. You may reveal 1 (Academy) Unit card/Command card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
