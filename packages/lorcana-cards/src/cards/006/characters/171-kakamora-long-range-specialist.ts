import type { CharacterCard } from "@tcg/lorcana-types";

export const kakamoraLongrangeSpecialist: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you have another Pirate character in play",
          type: "if",
        },
        then: {
          amount: 1,
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "deal-damage",
        },
        type: "conditional",
      },
      id: "10z-1",
      name: "A LITTLE HELP",
      text: "A LITTLE HELP When you play this character, if you have another Pirate character in play, you may deal 1 damage to chosen character or location.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 171,
  cardType: "character",
  classifications: ["Storyborn", "Pirate"],
  cost: 1,
  externalIds: {
    ravensburger: "854ac978a94ec987ff018655c529e3e0c8c5aaa7",
  },
  franchise: "Moana",
  fullName: "Kakamora - Long-Range Specialist",
  id: "10z",
  inkType: ["steel"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Kakamora",
  set: "006",
  strength: 0,
  text: "A LITTLE HELP When you play this character, if you have another Pirate character in play, you may deal 1 damage to chosen character or location.",
  version: "Long-Range Specialist",
  willpower: 2,
};
