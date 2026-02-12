import type { CharacterCard } from "@tcg/lorcana-types";

export const ursulaDeceiverOfAll: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      id: "1gd-1",
      name: "WHAT A DEAL",
      text: "WHAT A DEAL Whenever this character sings a song, you may play that song again from your discard for free, then put it on the bottom of your deck.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 91,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  cost: 3,
  externalIds: {
    ravensburger: "bccdff72dc44581df3cb3328c67dd24f72bbc799",
  },
  franchise: "Little Mermaid",
  fullName: "Ursula - Deceiver of All",
  id: "1gd",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Ursula",
  set: "003",
  strength: 2,
  text: "WHAT A DEAL Whenever this character sings a song, you may play that song again from your discard for free, then put it on the bottom of your deck.",
  version: "Deceiver of All",
  willpower: 3,
};
