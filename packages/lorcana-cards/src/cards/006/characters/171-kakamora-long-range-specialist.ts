import type { CharacterCard } from "@tcg/lorcana-types";

export const kakamoraLongrangeSpecialist: CharacterCard = {
  id: "10z",
  cardType: "character",
  name: "Kakamora",
  version: "Long-Range Specialist",
  fullName: "Kakamora - Long-Range Specialist",
  inkType: ["steel"],
  franchise: "Moana",
  set: "006",
  text: "A LITTLE HELP When you play this character, if you have another Pirate character in play, you may deal 1 damage to chosen character or location.",
  cost: 1,
  strength: 0,
  willpower: 2,
  lore: 1,
  cardNumber: 171,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "854ac978a94ec987ff018655c529e3e0c8c5aaa7",
  },
  abilities: [
    {
      id: "10z-1",
      type: "triggered",
      name: "A LITTLE HELP",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have another Pirate character in play",
        },
        then: {
          type: "deal-damage",
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
      text: "A LITTLE HELP When you play this character, if you have another Pirate character in play, you may deal 1 damage to chosen character or location.",
    },
  ],
  classifications: ["Storyborn", "Pirate"],
};
