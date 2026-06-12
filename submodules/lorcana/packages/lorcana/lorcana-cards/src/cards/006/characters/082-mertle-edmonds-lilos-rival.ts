import type { CharacterCard } from "@tcg/lorcana-types";
import { mertleEdmondsLilosRivalI18n } from "./082-mertle-edmonds-lilos-rival.i18n";

export const mertleEdmondsLilosRival: CharacterCard = {
  id: "Tkf",
  canonicalId: "ci_Tkf",
  reprints: ["set6-082"],
  cardType: "character",
  name: "Mertle Edmonds",
  version: "Lilo's Rival",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "006",
  cardNumber: 82,
  rarity: "uncommon",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_23e456f99c354c9892c90d72d6992bcb",
    tcgPlayer: 588339,
  },
  classifications: ["Storyborn"],
  i18n: mertleEdmondsLilosRivalI18n,
};
