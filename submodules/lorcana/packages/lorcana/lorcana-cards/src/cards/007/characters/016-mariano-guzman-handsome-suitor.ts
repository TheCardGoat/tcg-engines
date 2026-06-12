import type { CharacterCard } from "@tcg/lorcana-types";
import { marianoGuzmanHandsomeSuitorI18n } from "./016-mariano-guzman-handsome-suitor.i18n";

export const marianoGuzmanHandsomeSuitor: CharacterCard = {
  id: "QkD",
  canonicalId: "ci_QkD",
  reprints: ["set7-016"],
  cardType: "character",
  name: "Mariano Guzman",
  version: "Handsome Suitor",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "007",
  cardNumber: 16,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e21853e17196454badd15ded13c064fc",
    tcgPlayer: 618688,
  },
  text: [
    {
      title: "I SEE YOU",
      description:
        "While you have a character named Dolores Madrigal in play, this character gets +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "15v-1",
      name: "I SEE YOU",
      type: "static",
      condition: {
        type: "has-named-character",
        controller: "you",
        name: "Dolores Madrigal",
      },
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      text: "I SEE YOU While you have a character named Dolores Madrigal in play, this character gets +1 {L}.",
    },
  ],
  i18n: marianoGuzmanHandsomeSuitorI18n,
};
