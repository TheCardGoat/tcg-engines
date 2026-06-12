import type { CharacterCard } from "@tcg/lorcana-types";
import { peteRottenGuyI18n } from "./086-pete-rotten-guy.i18n";

export const peteRottenGuy: CharacterCard = {
  id: "qJb",
  canonicalId: "ci_qJb",
  reprints: ["set4-086"],
  cardType: "character",
  name: "Pete",
  version: "Rotten Guy",
  inkType: ["emerald"],
  set: "004",
  cardNumber: 86,
  rarity: "uncommon",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_e99a28536b8c4a7e98db8ee70e564fba",
    tcgPlayer: 549516,
  },
  classifications: ["Storyborn", "Villain", "Musketeer"],
  i18n: peteRottenGuyI18n,
};
