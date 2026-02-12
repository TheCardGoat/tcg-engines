import type { CharacterCard } from "@tcg/lorcana-types";

export const tadashiHamadaGiftedRoboticist: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "top-of-deck",
          target: "CONTROLLER",
          facedown: true,
        },
        type: "optional",
      },
      id: "36l-1",
      text: "SOMEONE HAS TO HELP During an opponent’s turn, when this character is banished, you may put the top card of your deck into your inkwell facedown. Then, put this card into your inkwell facedown.",
      type: "action",
    },
  ],
  cardNumber: 155,
  cardType: "character",
  classifications: ["Storyborn", "Mentor", "Inventor"],
  cost: 3,
  externalIds: {
    ravensburger: "0b792081c2b89fd31e4a7614861b132820260595",
  },
  franchise: "Big Hero 6",
  fullName: "Tadashi Hamada - Gifted Roboticist",
  id: "36l",
  inkType: ["sapphire"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Tadashi Hamada",
  set: "006",
  strength: 2,
  text: "SOMEONE HAS TO HELP During an opponent’s turn, when this character is banished, you may put the top card of your deck into your inkwell facedown. Then, put this card into your inkwell facedown.",
  version: "Gifted Roboticist",
  willpower: 2,
};
