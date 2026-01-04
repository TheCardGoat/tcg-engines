import type { CharacterCard } from "@tcg/lorcana-types";

export const kuzcoWantedLlama: CharacterCard = {
  id: "zpa",
  cardType: "character",
  name: "Kuzco",
  version: "Wanted Llama",
  fullName: "Kuzco - Wanted Llama",
  inkType: ["amethyst"],
  franchise: "Emperors New Groove",
  set: "009",
  text: "OK, WHERE AM I? When this character is banished, you may draw a card.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 49,
  inkable: true,
  externalIds: {
    ravensburger: "80ac67a466b42aed5a364be95f561b6c881ac934",
  },
  abilities: [
    {
      id: "zpa-1",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "King"],
};
