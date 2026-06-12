import type { CharacterCard } from "@tcg/lorcana-types";
import { herculesBelovedHero as canonicalHerculesBelovedHero } from "../../004";

export const herculesBelovedHero: CharacterCard = {
  ...canonicalHerculesBelovedHero,
  id: "sss",
  reprints: ["set4-180", "set9-186"],
  set: "009",
  cardNumber: 186,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_37be647e4dfe481996bdf2bad1909176",
    tcgPlayer: 650119,
  },
};
