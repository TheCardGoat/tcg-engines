import type { CharacterCard } from "@tcg/lorcana-types";
import { support } from "../../../helpers/abilities/support";
import { daisyDuckGhostFinderI18n } from "./141-daisy-duck-ghost-finder.i18n";

export const daisyDuckGhostFinder: CharacterCard = {
  id: "IZj",
  canonicalId: "ci_2P5",
  reprints: ["set10-141"],
  cardType: "character",
  name: "Daisy Duck",
  version: "Ghost Finder",
  inkType: ["sapphire"],
  set: "010",
  cardNumber: 141,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8076e7de5c3a4681b8a91629932092e5",
    tcgPlayer: 660363,
  },
  text: "Support",
  classifications: ["Dreamborn", "Hero", "Detective"],
  abilities: [support],
  i18n: daisyDuckGhostFinderI18n,
};
