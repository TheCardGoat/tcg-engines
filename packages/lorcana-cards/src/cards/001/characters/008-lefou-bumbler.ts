import type { CharacterCard } from "@tcg/lorcana";

export const lefouBumbler: CharacterCard = {
  id: "9i4",
  cardType: "character",
  name: "LeFou",
  version: "Bumbler",
  fullName: "LeFou - Bumbler",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "001",
  text: "LOYAL If you have a character named Gaston in play, you pay 1 {I} less to play this character.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  cardNumber: 8,
  inkable: true,
  externalIds: {
    ravensburger: "224000dbb0cebd90c025c1855cfddd5fe747691f",
  },
  abilities: [
    {
      id: "9i4-1",
      text: "LOYAL If you have a character named Gaston in play, you pay 1 {I} less to play this character.",
      name: "LOYAL",
      type: "static",
      effect: {
        type: "cost-reduction",
        amount: 1,
        target: "SELF",
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
