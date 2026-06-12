import type { CharacterCard } from "@tcg/lorcana-types";
import { mamaOdieSolitarySageI18n } from "./057-mama-odie-solitary-sage.i18n";

export const mamaOdieSolitarySage: CharacterCard = {
  id: "Few",
  canonicalId: "ci_Few",
  reprints: ["set6-057"],
  cardType: "character",
  name: "Mama Odie",
  version: "Solitary Sage",
  inkType: ["amethyst"],
  franchise: "Princess and the Frog",
  set: "006",
  cardNumber: 57,
  rarity: "rare",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_c6f28ec2e7a94ce0901675915ba9ff7c",
    tcgPlayer: 591113,
  },
  text: [
    {
      title: "I HAVE TO DO EVERYTHING AROUND HERE",
      description:
        "Whenever you play a song, you may move up to 2 damage counters from chosen character to chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Sorcerer"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "move-damage",
          amount: { type: "up-to", value: 2 },
          from: "CHOSEN_CHARACTER",
          to: "CHOSEN_OPPOSING_CHARACTER",
        },
        type: "optional",
      },
      id: "Few-1",
      name: "I HAVE TO DO EVERYTHING AROUND HERE",
      text: "I HAVE TO DO EVERYTHING AROUND HERE Whenever you play a song, you may move up to 2 damage counters from chosen character to chosen opposing character.",
      trigger: {
        event: "play",
        on: {
          cardType: "song",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: mamaOdieSolitarySageI18n,
};
