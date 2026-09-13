import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04Encounter105: CommandCard = {
  cardNumber: "GD04-105",
  name: "Encounter",
  type: "command",
  color: "green",
  traits: [],
  id: "GD04-105",
  canonicalId: "GD04-105",
  externalIds: { bandai: "gundam:gd04-105" },
  slug: "encounter/gd04-105",
  displayName: "Encounter",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-105",
  printings: [
    {
      id: "GD04-105",
      artId: "GD04-105",
      setCode: "GD04",
      collectorNumber: "GD04-105",
      cardNumber: "GD04-105",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd04/GD04-105.webp",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-105_p1",
      artId: "GD04-105_p1",
      setCode: "GD04",
      collectorNumber: "GD04-105_p1",
      cardNumber: "GD04-105",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd04/GD04-105_p1.webp",
      productName: "Phantom Aria [GD04]",
    },
  ],
  reprints: ["GD04-105", "GD04-105_p1"],
  selectedPrintingId: "GD04-105",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd04/GD04-105.webp",
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
          action: {
            action: "lookAtTopDeck",
            count: 5,
            return: "chooseTop",
            randomizeRemainingToBottom: true,
            tutorFilter: {
              count: 1,
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
