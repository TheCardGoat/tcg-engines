import type { CharacterCard } from "@tcg/lorcana-types";

export const almaMadrigalFamilyMatriarch: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          putInto: "hand",
          shuffle: true,
          type: "search-deck",
        },
        type: "optional",
      },
      id: "6uc-1",
      name: "TO THE TABLE",
      text: "TO THE TABLE When you play this character, you may search your deck for a Madrigal character card and reveal that card to all players. Shuffle your deck and put that card on top of it.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 2,
  cardType: "character",
  classifications: ["Storyborn", "Mentor", "Madrigal"],
  cost: 3,
  externalIds: {
    ravensburger: "18a98fa235abcf4d0b586d93830e89dc0ca67460",
  },
  franchise: "Encanto",
  fullName: "Alma Madrigal - Family Matriarch",
  id: "6uc",
  inkType: ["amber"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Alma Madrigal",
  set: "004",
  strength: 1,
  text: "TO THE TABLE When you play this character, you may search your deck for a Madrigal character card and reveal that card to all players. Shuffle your deck and put that card on top of it.",
  version: "Family Matriarch",
  willpower: 3,
};
