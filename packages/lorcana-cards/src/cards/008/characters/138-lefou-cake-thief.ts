import type { CharacterCard } from "@tcg/lorcana-types";

export const lefouCakeThief: CharacterCard = {
  abilities: [
    {
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
      id: "13j-1",
      text: "ALL FOR ME {E}, Banish one of your items — Chosen opponent loses 1 lore and you gain 1 lore.",
      type: "activated",
    },
  ],
  cardNumber: 138,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "8e79bca168af9ababf4c78ca6193a25f88168742",
  },
  franchise: "Beauty and the Beast",
  fullName: "LeFou - Cake Thief",
  id: "13j",
  inkType: ["ruby", "sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "LeFou",
  set: "008",
  strength: 2,
  text: "ALL FOR ME {E}, Banish one of your items — Chosen opponent loses 1 lore and you gain 1 lore.",
  version: "Cake Thief",
  willpower: 2,
};
