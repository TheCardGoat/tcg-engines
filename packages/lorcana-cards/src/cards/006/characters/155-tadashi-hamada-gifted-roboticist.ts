import type { CharacterCard } from "@tcg/lorcana-types";

export const tadashiHamadaGiftedRoboticist: CharacterCard = {
  id: "36l",
  cardType: "character",
  name: "Tadashi Hamada",
  version: "Gifted Roboticist",
  fullName: "Tadashi Hamada - Gifted Roboticist",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "SOMEONE HAS TO HELP During an opponent’s turn, when this character is banished, you may put the top card of your deck into your inkwell facedown. Then, put this card into your inkwell facedown.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 155,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "0b792081c2b89fd31e4a7614861b132820260595",
  },
  abilities: [
    {
      id: "36l-1",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "top-of-deck",
          target: "CONTROLLER",
          facedown: true,
        },
        chooser: "CONTROLLER",
      },
      text: "SOMEONE HAS TO HELP During an opponent’s turn, when this character is banished, you may put the top card of your deck into your inkwell facedown. Then, put this card into your inkwell facedown.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Inventor"],
};
