import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04Encounter105: CommandCard = {
  cardNumber: "GD04-105",
  name: "Encounter",
  type: "command",
  color: "green",
  traits: [],
  id: "GD04-105",
  externalId: "gundam:gd04-105",
  slug: "encounter-gd04-105",
  displayName: "Encounter",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-105",
  printings: [
    {
      id: "GD04-105",
      collectorNumber: "GD04-105",
      cardNumber: "GD04-105",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-105.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-105.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-105_p1",
      collectorNumber: "GD04-105_p1",
      cardNumber: "GD04-105",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-105_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-105_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-105",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-105.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-105.webp?260424",
  legality: "legal",
  level: 5,
  cost: 1,
  effect:
    "【Main】Look at the top 5 cards of your deck. You may reveal 1 Pilot card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          // NOTE: Printed text reads "You **may** reveal 1 Pilot ... and
          // add it to your hand". The current engine `lookAtTopDeck`
          // handler auto-tutors `matches[0]` whenever the filter has a
          // candidate — there is no in-action "may" prompt for the
          // tutor sub-step. This encoding is the closest representable
          // shape: the player's choice to *not* tutor is collapsed into
          // an unconditional fire when a Pilot is in the top 5.
          action: {
            action: "lookAtTopDeck",
            count: 5,
            return: "chooseTop",
            tutorFilter: {
              owner: "friendly",
              cardType: "pilot",
            },
          },
        },
      ],
      sourceText:
        "【Main】Look at the top 5 cards of your deck. You may reveal 1 Pilot card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
