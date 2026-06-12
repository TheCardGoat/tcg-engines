import type { CharacterCard } from "@tcg/lorcana-types";
import { starkeyDeviousPirateI18n } from "./088-starkey-devious-pirate.i18n";

export const starkeyDeviousPirate: CharacterCard = {
  id: "j3Z",
  canonicalId: "ci_j3Z",
  reprints: ["set3-088"],
  cardType: "character",
  name: "Starkey",
  version: "Devious Pirate",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "003",
  cardNumber: 88,
  rarity: "uncommon",
  cost: 7,
  strength: 6,
  willpower: 6,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_92c7a997ed6f441a807e91c8bd5aa470",
    tcgPlayer: 537946,
  },
  classifications: ["Storyborn", "Ally", "Pirate"],
  i18n: starkeyDeviousPirateI18n,
};
