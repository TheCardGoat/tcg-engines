import type { CharacterCard } from "@tcg/lorcana-types";
import { arthurDeterminedSquireI18n } from "./168-arthur-determined-squire.i18n";

export const arthurDeterminedSquire: CharacterCard = {
  id: "LcR",
  canonicalId: "ci_LcR",
  reprints: ["set8-168"],
  cardType: "character",
  name: "Arthur",
  version: "Determined Squire",
  inkType: ["sapphire", "steel"],
  franchise: "Sword in the Stone",
  set: "008",
  cardNumber: 168,
  rarity: "uncommon",
  cost: 4,
  strength: 6,
  willpower: 6,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_c79a6e612467451ca809ce7ed1a9889f",
    tcgPlayer: 631763,
  },
  text: [
    {
      title: "NO MORE BOOKS",
      description: "Skip your turn's Draw step.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        restriction: "skip-draw-step",
        target: "CONTROLLER",
        type: "restriction",
      },
      id: "LcR-1",
      name: "NO MORE BOOKS",
      text: "NO MORE BOOKS Skip your turn's Draw step.",
      type: "static",
    },
  ],
  i18n: arthurDeterminedSquireI18n,
};
