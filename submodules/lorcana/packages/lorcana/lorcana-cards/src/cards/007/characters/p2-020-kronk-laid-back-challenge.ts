import type { CharacterCard } from "@tcg/lorcana-types";
import { kronkLaidBackP2ChallengeI18n } from "./p2-020-kronk-laid-back-challenge.i18n";

import { ward } from "../../../helpers/abilities/ward";

export const kronkLaidBackP2Challenge: CharacterCard = {
  id: "D4J",
  canonicalId: "ci_cMj",
  slug: "lorcana-ci_cMj",
  printings: [
    {
      id: "set7-p2-020-challenge",
      artId: "ci_cMj-challenge",
      setCode: "set7",
      collectorNumber: "20",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set7-063"],
  cardType: "character",
  name: "Kronk",
  version: "Laid Back",
  inkType: ["amethyst", "emerald"],
  franchise: "Emperors New Groove",
  set: "007",
  cardNumber: 20,
  rarity: "special",
  specialRarity: "challenge",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_10a145c920e14c17b01173d348247d95",
    tcgPlayer: "619441",
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "I'M LOVIN' THIS",
      description: "If an effect would cause you to discard one or more cards, you don't discard.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    ward,
    {
      id: "im-lovin-this",
      name: "I'M LOVIN' THIS",
      type: "replacement",
      replaces: "discard",
      replacement: "prevent",
      text: "I'M LOVIN' THIS - If an effect would cause you to discard one or more cards, you don't discard.",
    },
  ],
  i18n: kronkLaidBackP2ChallengeI18n,
};
