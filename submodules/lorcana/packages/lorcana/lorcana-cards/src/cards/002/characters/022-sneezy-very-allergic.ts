import type { CharacterCard } from "@tcg/lorcana-types";
import { sneezyVeryAllergicI18n } from "./022-sneezy-very-allergic.i18n";

export const sneezyVeryAllergic: CharacterCard = {
  id: "hWr",
  canonicalId: "ci_hWr",
  reprints: ["set2-022"],
  cardType: "character",
  name: "Sneezy",
  version: "Very Allergic",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  cardNumber: 22,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e7b04611dd234fc7a07b0e48c2811fd2",
    tcgPlayer: 526375,
  },
  text: [
    {
      title: "AH-CHOO!",
      description:
        "Whenever you play this character or another Seven Dwarfs character, you may give chosen character -1 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: -1,
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        },
      },
      id: "1g9-1",
      name: "AH-CHOO!",
      text: "AH-CHOO! Whenever you play this character or another Seven Dwarfs character, you may give chosen character -1 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      effect: {
        type: "optional",
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: -1,
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        },
      },
      id: "1g9-2",
      name: "AH-CHOO!",
      text: "AH-CHOO! Whenever you play this character or another Seven Dwarfs character, you may give chosen character -1 {S} this turn.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Seven Dwarfs",
          excludeSelf: true,
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: sneezyVeryAllergicI18n,
};
