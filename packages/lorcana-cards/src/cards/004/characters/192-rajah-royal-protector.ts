import type { CharacterCard } from "@tcg/lorcana-types";

export const rajahRoyalProtector: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        target: "SELF",
      },
      id: "f6t-1",
      text: "STEADY GAZE While you have no cards in your hand, characters with cost 4 or less can't challenge this character.",
      type: "action",
    },
  ],
  cardNumber: 192,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "36be3bec8183584cb53505ad713a85eb409bbbf4",
  },
  franchise: "Aladdin",
  fullName: "Rajah - Royal Protector",
  id: "f6t",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Rajah",
  set: "004",
  strength: 3,
  text: "STEADY GAZE While you have no cards in your hand, characters with cost 4 or less can't challenge this character.",
  version: "Royal Protector",
  willpower: 4,
};
