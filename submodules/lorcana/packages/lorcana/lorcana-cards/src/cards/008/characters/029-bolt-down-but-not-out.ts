import type { CharacterCard } from "@tcg/lorcana-types";
import { boltDownButNotOutI18n } from "./029-bolt-down-but-not-out.i18n";

export const boltDownButNotOut: CharacterCard = {
  id: "9Ny",
  canonicalId: "ci_9Ny",
  reprints: ["set8-029"],
  cardType: "character",
  name: "Bolt",
  version: "Down but Not Out",
  inkType: ["amber", "steel"],
  franchise: "Bolt",
  set: "008",
  cardNumber: 29,
  rarity: "rare",
  cost: 3,
  strength: 0,
  willpower: 4,
  lore: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_2571eeb8c4914f82863610ee7c92535a",
    tcgPlayer: 631371,
  },
  text: [
    {
      title: "NONE OF YOUR POWERS ARE WORKING",
      description: "This character enters play exerted.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        restriction: "enters-play-exerted",
        target: "SELF",
        type: "restriction",
      },
      id: "1q7-1",
      name: "NONE OF YOUR POWERS ARE WORKING",
      text: "NONE OF YOUR POWERS ARE WORKING This character enters play exerted.",
      type: "static",
    },
  ],
  i18n: boltDownButNotOutI18n,
};
