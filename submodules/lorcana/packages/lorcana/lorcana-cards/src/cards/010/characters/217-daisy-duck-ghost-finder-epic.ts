import type { CharacterCard } from "@tcg/lorcana-types";
import { daisyDuckGhostFinderEpicI18n } from "./217-daisy-duck-ghost-finder-epic.i18n";

import { support } from "../../../helpers/abilities/support";

export const daisyDuckGhostFinderEpic: CharacterCard = {
  id: "aBY",
  canonicalId: "ci_2P5",
  slug: "lorcana-ci_2P5",
  printings: [
    {
      id: "set10-217-epic",
      artId: "ci_2P5-epic",
      setCode: "set10",
      collectorNumber: "217",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set10-141"],
  cardType: "character",
  name: "Daisy Duck",
  version: "Ghost Finder",
  inkType: ["sapphire"],
  set: "010",
  cardNumber: 217,
  rarity: "common",
  specialRarity: "epic",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8076e7de5c3a4681b8a91629932092e5",
    tcgPlayer: "660363",
  },
  text: "Support",
  classifications: ["Dreamborn", "Hero", "Detective"],
  abilities: [support],
  i18n: daisyDuckGhostFinderEpicI18n,
};
