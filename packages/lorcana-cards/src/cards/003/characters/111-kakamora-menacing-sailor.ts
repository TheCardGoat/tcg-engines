import type { CharacterCard } from "@tcg/lorcana-types";

export const kakamoraMenacingSailor: CharacterCard = {
  id: "1xv",
  cardType: "character",
  name: "Kakamora",
  version: "Menacing Sailor",
  fullName: "Kakamora - Menacing Sailor",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "003",
  text: "PLUNDER When you play this character, each opponent loses 1 lore.",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 111,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "fbdab18779b11cb100204c757f27c424d9dc510c",
  },
  abilities: [
    {
      id: "1xv-1",
      type: "triggered",
      name: "PLUNDER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
      text: "PLUNDER When you play this character, each opponent loses 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Pirate"],
};
