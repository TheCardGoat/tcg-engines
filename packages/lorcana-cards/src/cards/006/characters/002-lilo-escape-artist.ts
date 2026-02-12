import type { CharacterCard } from "@tcg/lorcana-types";

export const liloEscapeArtist: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "this card is in your discard",
          type: "if",
        },
        then: {
          restriction: "enters-play-exerted",
          target: "SELF",
          type: "restriction",
        },
        type: "conditional",
      },
      id: "105-1",
      text: "NO PLACE I’D RATHER BE At the start of your turn, if this card is in your discard, you may play her and she enters play exerted.",
      type: "static",
    },
  ],
  cardNumber: 2,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "84622499364f41f7265a750bae22792b349b212d",
  },
  franchise: "Lilo and Stitch",
  fullName: "Lilo - Escape Artist",
  id: "105",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Lilo",
  set: "006",
  strength: 1,
  text: "NO PLACE I’D RATHER BE At the start of your turn, if this card is in your discard, you may play her and she enters play exerted.",
  version: "Escape Artist",
  willpower: 2,
};
