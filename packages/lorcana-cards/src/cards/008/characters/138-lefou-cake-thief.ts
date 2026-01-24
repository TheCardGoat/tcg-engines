import type { CharacterCard } from "@tcg/lorcana-types";

export const lefouCakeThief: CharacterCard = {
  id: "13j",
  cardType: "character",
  name: "LeFou",
  version: "Cake Thief",
  fullName: "LeFou - Cake Thief",
  inkType: ["ruby", "sapphire"],
  franchise: "Beauty and the Beast",
  set: "008",
  text: "ALL FOR ME {E}, Banish one of your items — Chosen opponent loses 1 lore and you gain 1 lore.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 138,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8e79bca168af9ababf4c78ca6193a25f88168742",
  },
  abilities: [
    {
      id: "13j-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "lose-lore",
            amount: 1,
            target: "OPPONENT",
          },
          {
            type: "gain-lore",
            amount: 1,
          },
        ],
      },
      text: "ALL FOR ME {E}, Banish one of your items — Chosen opponent loses 1 lore and you gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
