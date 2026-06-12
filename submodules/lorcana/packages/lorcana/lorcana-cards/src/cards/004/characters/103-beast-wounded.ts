import type { CharacterCard } from "@tcg/lorcana-types";
import { beastWoundedI18n } from "./103-beast-wounded.i18n";

export const beastWounded: CharacterCard = {
  id: "f3O",
  canonicalId: "ci_f3O",
  reprints: ["set4-103"],
  cardType: "character",
  name: "Beast",
  version: "Wounded",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "004",
  cardNumber: 103,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c3acd1c879e645779501109c65580c93",
    tcgPlayer: 550588,
  },
  text: [
    {
      title: "THAT HURTS!",
      description: "This character enters play with 4 damage.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    {
      effect: {
        amount: 4,
        type: "enters-with-damage",
      },
      id: "hmw-1",
      name: "THAT HURTS!",
      text: "THAT HURTS! This character enters play with 4 damage.",
      type: "static",
    },
  ],
  i18n: beastWoundedI18n,
};
