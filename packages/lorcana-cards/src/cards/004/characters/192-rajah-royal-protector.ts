import type { CharacterCard } from "@tcg/lorcana-types";

export const rajahRoyalProtector: CharacterCard = {
  id: "f6t",
  cardType: "character",
  name: "Rajah",
  version: "Royal Protector",
  fullName: "Rajah - Royal Protector",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "004",
  text: "STEADY GAZE While you have no cards in your hand, characters with cost 4 or less can't challenge this character.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 192,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "36be3bec8183584cb53505ad713a85eb409bbbf4",
  },
  abilities: [
    {
      id: "f6t-1",
      type: "action",
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        target: "SELF",
      },
      text: "STEADY GAZE While you have no cards in your hand, characters with cost 4 or less can't challenge this character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
