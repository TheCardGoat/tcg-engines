import type { CharacterCard } from "@tcg/lorcana-types";
import { pennyTheOrphanCleverChildI18n } from "./171-penny-the-orphan-clever-child.i18n";

export const pennyTheOrphanCleverChild: CharacterCard = {
  id: "Dl9",
  canonicalId: "ci_Dl9",
  reprints: ["set7-171"],
  cardType: "character",
  name: "Penny the Orphan",
  version: "Clever Child",
  inkType: ["sapphire"],
  franchise: "Rescuers",
  set: "007",
  cardNumber: 171,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ca23777aebb648ae879ec623bc4f760d",
    tcgPlayer: 619504,
  },
  text: [
    {
      title: "OUR BOTTLE WORKED!",
      description: "While you have a Hero character in play, this character gains Ward.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        type: "has-character-with-classification",
        classification: "Hero",
        controller: "you",
      },
      effect: {
        keyword: "Ward",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "szl-1",
      name: "OUR BOTTLE WORKED!",
      text: "OUR BOTTLE WORKED! While you have a Hero character in play, this character gains Ward.",
      type: "static",
    },
  ],
  i18n: pennyTheOrphanCleverChildI18n,
};
