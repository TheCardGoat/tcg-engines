import type { CharacterCard } from "@tcg/lorcana-types";

export const liloEscapeArtist: CharacterCard = {
  id: "105",
  cardType: "character",
  name: "Lilo",
  version: "Escape Artist",
  fullName: "Lilo - Escape Artist",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "NO PLACE I’D RATHER BE At the start of your turn, if this card is in your discard, you may play her and she enters play exerted.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  cardNumber: 2,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "84622499364f41f7265a750bae22792b349b212d",
  },
  abilities: [
    {
      id: "105-1",
      type: "static",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "this card is in your discard",
        },
        then: {
          type: "restriction",
          restriction: "enters-play-exerted",
          target: "SELF",
        },
      },
      text: "NO PLACE I’D RATHER BE At the start of your turn, if this card is in your discard, you may play her and she enters play exerted.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
