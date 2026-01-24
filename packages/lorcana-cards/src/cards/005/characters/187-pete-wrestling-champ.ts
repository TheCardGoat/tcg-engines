import type { CharacterCard } from "@tcg/lorcana-types";

export const peteWrestlingChamp: CharacterCard = {
  id: "pvv",
  cardType: "character",
  name: "Pete",
  version: "Wrestling Champ",
  fullName: "Pete - Wrestling Champ",
  inkType: ["steel"],
  set: "005",
  text: "RE-PETE {E} - Reveal the top card of your deck. If it's a character card named Pete, you may play it for free.",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 187,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "5d4ac7161bfe7af9982b72789e53ee2a506ae7bf",
  },
  abilities: [
    {
      id: "pvv-1",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "it's a character card named Pete",
        },
        then: {
          type: "play-card",
          from: "hand",
          cost: "free",
        },
      },
      text: "RE-PETE {E} - Reveal the top card of your deck. If it's a character card named Pete, you may play it for free.",
    },
  ],
  classifications: ["Dreamborn", "Villain"],
};
