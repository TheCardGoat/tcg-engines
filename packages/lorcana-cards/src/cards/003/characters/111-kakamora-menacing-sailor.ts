import type { CharacterCard } from "@tcg/lorcana-types";

export const kakamoraMenacingSailor: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      id: "1xv-1",
      name: "PLUNDER",
      text: "PLUNDER When you play this character, each opponent loses 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 111,
  cardType: "character",
  classifications: ["Storyborn", "Pirate"],
  cost: 3,
  externalIds: {
    ravensburger: "fbdab18779b11cb100204c757f27c424d9dc510c",
  },
  franchise: "Moana",
  fullName: "Kakamora - Menacing Sailor",
  id: "1xv",
  inkType: ["ruby"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Kakamora",
  set: "003",
  strength: 3,
  text: "PLUNDER When you play this character, each opponent loses 1 lore.",
  version: "Menacing Sailor",
  willpower: 2,
};
