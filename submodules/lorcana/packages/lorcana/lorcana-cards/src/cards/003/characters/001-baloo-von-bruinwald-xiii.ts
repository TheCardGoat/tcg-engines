import type { CharacterCard } from "@tcg/lorcana-types";
import { balooVonBruinwaldXiiiI18n } from "./001-baloo-von-bruinwald-xiii.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const balooVonBruinwaldXiii: CharacterCard = {
  id: "LOs",
  canonicalId: "ci_LOs",
  reprints: ["set3-001"],
  cardType: "character",
  name: "Baloo",
  version: "von Bruinwald XIII",
  inkType: ["amber"],
  franchise: "Talespin",
  set: "003",
  cardNumber: 1,
  rarity: "rare",
  cost: 3,
  strength: 0,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_2867c1fd1a954efabc42975882f5be8c",
    tcgPlayer: 539060,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "LET'S MAKE LIKE A TREE",
      description: "When this character is banished, gain 2 lore.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    bodyguard,
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "owv-2",
      name: "LET'S MAKE LIKE A TREE",
      text: "LET'S MAKE LIKE A TREE When this character is banished, gain 2 lore.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: balooVonBruinwaldXiiiI18n,
};
