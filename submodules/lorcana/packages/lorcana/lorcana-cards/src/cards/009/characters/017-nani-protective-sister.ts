import type { CharacterCard } from "@tcg/lorcana-types";
import { naniProtectiveSister as canonicalNaniProtectiveSister } from "../../003";

export const naniProtectiveSister: CharacterCard = {
  ...canonicalNaniProtectiveSister,
  id: "UJ6",
  reprints: ["set3-012", "set9-017"],
  set: "009",
  cardNumber: 17,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_46a9657cca954d1981ba9f69647ebe44",
    tcgPlayer: 649965,
  },
};
