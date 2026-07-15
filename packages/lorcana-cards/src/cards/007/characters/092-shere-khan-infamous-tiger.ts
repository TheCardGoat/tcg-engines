import type { CharacterCard } from "@tcg/lorcana-types";

export const shereKhanInfamousTiger: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: -1,
        target: "CONTROLLER",
        type: "discard",
      },
      id: "1r2-1",
      name: "WHAT A PITY",
      text: "WHAT A PITY When you play this character, discard your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 92,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 4,
  externalIds: {
    ravensburger: "e5c04a374746e0b16d522ecd3804b6024ae6ad38",
  },
  franchise: "Jungle Book",
  fullName: "Shere Khan - Infamous Tiger",
  id: "1r2",
  inkType: ["emerald"],
  inkable: false,
  lore: 4,
  missingTests: true,
  name: "Shere Khan",
  set: "007",
  strength: 4,
  text: "WHAT A PITY When you play this character, discard your hand.",
  version: "Infamous Tiger",
  willpower: 4,
};
