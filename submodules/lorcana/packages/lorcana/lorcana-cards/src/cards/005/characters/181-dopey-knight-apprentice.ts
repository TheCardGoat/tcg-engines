import type { CharacterCard } from "@tcg/lorcana-types";
import { dopeyKnightApprenticeI18n } from "./181-dopey-knight-apprentice.i18n";

export const dopeyKnightApprentice: CharacterCard = {
  id: "kCO",
  canonicalId: "ci_kCO",
  reprints: ["set5-181"],
  cardType: "character",
  name: "Dopey",
  version: "Knight Apprentice",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  cardNumber: 181,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8711108b2bca45a18bcabd2f982d0457",
    tcgPlayer: 559667,
  },
  text: [
    {
      title: "STRONGER TOGETHER",
      description:
        "When you play this character, if you have another Knight character in play, you may deal 1 damage to chosen character or location.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
  abilities: [
    {
      condition: {
        type: "has-character-count",
        classification: "Knight",
        controller: "you",
        count: 2,
        comparison: "greater-or-equal",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character", "location"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "1w8-1",
      name: "STRONGER TOGETHER",
      text: "STRONGER TOGETHER When you play this character, if you have another Knight character in play, you may deal 1 damage to chosen character or location.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: dopeyKnightApprenticeI18n,
};
