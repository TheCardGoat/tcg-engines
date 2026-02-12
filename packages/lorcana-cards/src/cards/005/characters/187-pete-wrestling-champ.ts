import type { CharacterCard } from "@tcg/lorcana-types";

export const peteWrestlingChamp: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "it's a character card named Pete",
        },
        then: {
          type: "play-card",
          from: "hand",
          cost: "free",
        },
        type: "conditional",
      },
      id: "pvv-1",
      text: "RE-PETE {E} - Reveal the top card of your deck. If it's a character card named Pete, you may play it for free.",
      type: "action",
    },
  ],
  cardNumber: 187,
  cardType: "character",
  classifications: ["Dreamborn", "Villain"],
  cost: 3,
  externalIds: {
    ravensburger: "5d4ac7161bfe7af9982b72789e53ee2a506ae7bf",
  },
  fullName: "Pete - Wrestling Champ",
  id: "pvv",
  inkType: ["steel"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Pete",
  set: "005",
  strength: 1,
  text: "RE-PETE {E} - Reveal the top card of your deck. If it's a character card named Pete, you may play it for free.",
  version: "Wrestling Champ",
  willpower: 3,
};
