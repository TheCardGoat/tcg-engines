import type { CharacterCard } from "@tcg/lorcana-types";
import { wildcatMechanic as canonicalWildcatMechanic } from "../../003";

export const wildcatMechanic: CharacterCard = {
  ...canonicalWildcatMechanic,
  id: "Xbs",
  reprints: ["set3-092", "set9-091"],
  set: "009",
  cardNumber: 91,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_c7a6168b43fd4c71a441f6f2e236117b",
    tcgPlayer: 650030,
  },
};
