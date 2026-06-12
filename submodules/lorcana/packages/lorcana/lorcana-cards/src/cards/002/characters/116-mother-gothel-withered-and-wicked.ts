import type { CharacterCard } from "@tcg/lorcana-types";
import { motherGothelWitheredAndWickedI18n } from "./116-mother-gothel-withered-and-wicked.i18n";

export const motherGothelWitheredAndWicked: CharacterCard = {
  id: "5YN",
  canonicalId: "ci_5YN",
  reprints: ["set2-116"],
  cardType: "character",
  name: "Mother Gothel",
  version: "Withered and Wicked",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "002",
  cardNumber: 116,
  rarity: "uncommon",
  cost: 2,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0bac00816e484c9897881390d90a614f",
    tcgPlayer: 527253,
  },
  text: [
    {
      title: "WHAT HAVE YOU DONE?!",
      description: "This character enters play with 3 damage.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        amount: 3,
        type: "enters-with-damage",
      },
      id: "6fh-1",
      name: "WHAT HAVE YOU DONE?!",
      text: "WHAT HAVE YOU DONE?! This character enters play with 3 damage.",
      type: "static",
    },
  ],
  i18n: motherGothelWitheredAndWickedI18n,
};
