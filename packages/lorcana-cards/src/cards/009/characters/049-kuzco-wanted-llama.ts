import type { CharacterCard } from "@tcg/lorcana-types";

export const kuzcoWantedLlama: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "zpa-1",
      text: "OK, WHERE AM I? When this character is banished, you may draw a card.",
      type: "action",
    },
  ],
  cardNumber: 49,
  cardType: "character",
  classifications: ["Storyborn", "King"],
  cost: 2,
  externalIds: {
    ravensburger: "80ac67a466b42aed5a364be95f561b6c881ac934",
  },
  franchise: "Emperors New Groove",
  fullName: "Kuzco - Wanted Llama",
  id: "zpa",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "Kuzco",
  set: "009",
  strength: 1,
  text: "OK, WHERE AM I? When this character is banished, you may draw a card.",
  version: "Wanted Llama",
  willpower: 2,
};
