import type { CharacterCard } from "@tcg/lorcana-types";
import { belleInventiveEngineer as canonicalBelleInventiveEngineer } from "../../001";

export const belleInventiveEngineer: CharacterCard = {
  ...canonicalBelleInventiveEngineer,
  id: "1AR",
  reprints: ["set1-141", "set9-156"],
  set: "009",
  cardNumber: 156,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_b77ec6c391cd4ccaa1b1e01ca897502d",
    tcgPlayer: 650091,
  },
};
