import type { CharacterCard } from "@tcg/lorcana-types";
import { arthurWartI18n } from "./190-arthur-wart.i18n";

export const arthurWart: CharacterCard = {
  id: "2AA",
  canonicalId: "ci_2AA",
  reprints: ["set5-190"],
  cardType: "character",
  name: "Arthur",
  version: "Wart",
  inkType: ["steel"],
  franchise: "Sword in the Stone",
  set: "005",
  cardNumber: 190,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_93993a91205c4c6bb310fd17b0417b7f",
    tcgPlayer: 561298,
  },
  classifications: ["Storyborn", "Hero"],
  i18n: arthurWartI18n,
};
