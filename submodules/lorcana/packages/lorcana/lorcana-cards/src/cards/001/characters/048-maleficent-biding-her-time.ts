import type { CharacterCard } from "@tcg/lorcana-types";
import { maleficentBidingHerTimeI18n } from "./048-maleficent-biding-her-time.i18n";

export const maleficentBidingHerTime: CharacterCard = {
  id: "6FJ",
  canonicalId: "ci_6FJ",
  reprints: ["set1-048"],
  cardType: "character",
  name: "Maleficent",
  version: "Biding Her Time",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "001",
  cardNumber: 48,
  rarity: "rare",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 2,
  inkable: false,
  vanilla: true,
  externalIds: {
    lorcast: "crd_ed5b22e519844e948a57784cdc4d5a48",
    tcgPlayer: 493485,
  },
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  i18n: maleficentBidingHerTimeI18n,
};
