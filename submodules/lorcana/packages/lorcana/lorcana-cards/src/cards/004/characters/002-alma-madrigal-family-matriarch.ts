import type { CharacterCard } from "@tcg/lorcana-types";
import { almaMadrigalFamilyMatriarchI18n } from "./002-alma-madrigal-family-matriarch.i18n";

export const almaMadrigalFamilyMatriarch: CharacterCard = {
  id: "AOO",
  canonicalId: "ci_AOO",
  reprints: ["set4-002"],
  cardType: "character",
  name: "Alma Madrigal",
  version: "Family Matriarch",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "004",
  cardNumber: 2,
  rarity: "rare",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_a853bb92fbe7486ea510a97f6a8494e2",
    tcgPlayer: 550553,
  },
  text: [
    {
      title: "TO THE TABLE",
      description:
        "When you play this character, you may search your deck for a Madrigal character card and reveal that card to all players. Shuffle your deck and put that card on top of it.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Madrigal"],
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
  i18n: almaMadrigalFamilyMatriarchI18n,
};
