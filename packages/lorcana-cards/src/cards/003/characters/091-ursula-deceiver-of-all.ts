import type { CharacterCard } from "@tcg/lorcana-types";

export const ursulaDeceiverOfAll: CharacterCard = {
  id: "1gd",
  cardType: "character",
  name: "Ursula",
  version: "Deceiver of All",
  fullName: "Ursula - Deceiver of All",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "003",
  text: "WHAT A DEAL Whenever this character sings a song, you may play that song again from your discard for free, then put it on the bottom of your deck.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 91,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bccdff72dc44581df3cb3328c67dd24f72bbc799",
  },
  abilities: [
    {
      id: "1gd-1",
      type: "triggered",
      name: "WHAT A DEAL",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      text: "WHAT A DEAL Whenever this character sings a song, you may play that song again from your discard for free, then put it on the bottom of your deck.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
};
