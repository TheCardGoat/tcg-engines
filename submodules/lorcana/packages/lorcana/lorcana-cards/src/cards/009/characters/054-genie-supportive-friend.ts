import type { CharacterCard } from "@tcg/lorcana-types";
import { genieSupportiveFriend as canonicalGenieSupportiveFriend } from "../../003";

export const genieSupportiveFriend: CharacterCard = {
  ...canonicalGenieSupportiveFriend,
  id: "sVk",
  reprints: ["set3-038", "set9-054"],
  set: "009",
  cardNumber: 54,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_777ef1df73214a63a89bce29396afefa",
    tcgPlayer: 649998,
  },
};
