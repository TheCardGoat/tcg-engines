import type { CharacterCard } from "@tcg/lorcana-types";

export const shereKhanInfamousTiger: CharacterCard = {
  id: "1r2",
  cardType: "character",
  name: "Shere Khan",
  version: "Infamous Tiger",
  fullName: "Shere Khan - Infamous Tiger",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "007",
  text: "WHAT A PITY When you play this character, discard your hand.",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 4,
  cardNumber: 92,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "e5c04a374746e0b16d522ecd3804b6024ae6ad38",
  },
  abilities: [
    {
      id: "1r2-1",
      type: "triggered",
      name: "WHAT A PITY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "discard",
        amount: -1,
        target: "CONTROLLER",
      },
      text: "WHAT A PITY When you play this character, discard your hand.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
