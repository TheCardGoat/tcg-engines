import type { CharacterCard } from "@tcg/lorcana-types";

export const almaMadrigalFamilyMatriarch: CharacterCard = {
  id: "6uc",
  cardType: "character",
  name: "Alma Madrigal",
  version: "Family Matriarch",
  fullName: "Alma Madrigal - Family Matriarch",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "004",
  text: "TO THE TABLE When you play this character, you may search your deck for a Madrigal character card and reveal that card to all players. Shuffle your deck and put that card on top of it.",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  cardNumber: 2,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "18a98fa235abcf4d0b586d93830e89dc0ca67460",
  },
  abilities: [
    {
      id: "6uc-1",
      type: "triggered",
      name: "TO THE TABLE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "search-deck",
          putInto: "hand",
          shuffle: true,
        },
        chooser: "CONTROLLER",
      },
      text: "TO THE TABLE When you play this character, you may search your deck for a Madrigal character card and reveal that card to all players. Shuffle your deck and put that card on top of it.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Madrigal"],
};
