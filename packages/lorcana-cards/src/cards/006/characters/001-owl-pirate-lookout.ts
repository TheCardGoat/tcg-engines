import type { CharacterCard } from "@tcg/lorcana-types";

export const owlPirateLookout: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "CHOSEN_CHARACTER",
      },
      id: "kq3-1",
      name: "WELL SPOTTED",
      text: "WELL SPOTTED During your turn, whenever a card is put into your inkwell, chosen opposing character gets -1 {S} until the start of your next turn.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 1,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Pirate"],
  cost: 3,
  externalIds: {
    ravensburger: "4ab1a2c7f0197a4df9d436fc82d25fb88371a3ec",
  },
  franchise: "Winnie the Pooh",
  fullName: "Owl - Pirate Lookout",
  id: "kq3",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Owl",
  set: "006",
  strength: 3,
  text: "WELL SPOTTED During your turn, whenever a card is put into your inkwell, chosen opposing character gets -1 {S} until the start of your next turn.",
  version: "Pirate Lookout",
  willpower: 3,
};
