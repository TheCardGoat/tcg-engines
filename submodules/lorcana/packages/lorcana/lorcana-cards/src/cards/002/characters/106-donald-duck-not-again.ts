import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckNotAgainI18n } from "./106-donald-duck-not-again.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const donaldDuckNotAgain: CharacterCard = {
  id: "2q9",
  canonicalId: "ci_2q9",
  reprints: ["set2-106"],
  cardType: "character",
  name: "Donald Duck",
  version: "Not Again!",
  inkType: ["ruby"],
  set: "002",
  cardNumber: 106,
  rarity: "legendary",
  cost: 5,
  strength: 1,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9599f783023446468e24ada470972aa4",
    tcgPlayer: 527754,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "PHOOEY!",
      description: "This character gets +1 {L} for each 1 damage on him.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    evasive,
    {
      effect: {
        modifier: {
          type: "damage-on-self",
        },
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1mm-2",
      name: "PHOOEY!",
      text: "PHOOEY! This character gets +1 {L} for each 1 damage on him.",
      type: "static",
    },
  ],
  i18n: donaldDuckNotAgainI18n,
};
