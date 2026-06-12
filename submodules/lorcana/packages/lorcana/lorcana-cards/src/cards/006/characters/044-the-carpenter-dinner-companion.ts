import type { CharacterCard } from "@tcg/lorcana-types";
import { theCarpenterDinnerCompanionI18n } from "./044-the-carpenter-dinner-companion.i18n";

export const theCarpenterDinnerCompanion: CharacterCard = {
  id: "BhW",
  canonicalId: "ci_BhW",
  reprints: ["set6-044"],
  cardType: "character",
  name: "The Carpenter",
  version: "Dinner Companion",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "006",
  cardNumber: 44,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_034ca9ad96044d5297e30286fbd64ecb",
    tcgPlayer: 587934,
  },
  text: [
    {
      title: "I'LL GET YOU!",
      description: "When this character is banished, you may exert chosen character.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "exert",
        },
        type: "optional",
      },
      id: "pff-1",
      name: "I'LL GET YOU!",
      text: "I'LL GET YOU! When this character is banished, you may exert chosen character.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: theCarpenterDinnerCompanionI18n,
};
