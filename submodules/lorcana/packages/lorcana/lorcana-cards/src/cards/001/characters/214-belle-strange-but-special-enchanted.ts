import type { CharacterCard } from "@tcg/lorcana-types";
import { belleStrangeButSpecial } from "./142-belle-strange-but-special";

export const belleStrangeButSpecialEnchanted: CharacterCard = {
  ...belleStrangeButSpecial,
  id: "Mfr",
  reprints: ["set1-142"],
  set: "001",
  cardNumber: 214,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_021c1d57c42d4fb7836097cbe9eacfb7",
    tcgPlayer: 510161,
  },
};
