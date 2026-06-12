import type { CharacterCard } from "@tcg/lorcana-types";
import { enchantressUnexpectedJudge as canonicalEnchantressUnexpectedJudge } from "../../002";

export const enchantressUnexpectedJudge: CharacterCard = {
  ...canonicalEnchantressUnexpectedJudge,
  id: "hyz",
  reprints: ["set2-080", "set9-081"],
  set: "009",
  cardNumber: 81,
  rarity: "common",
  externalIds: {
    lorcast: "crd_140b8662d4f1474e8c39019b0bfbd3f3",
    tcgPlayer: 650021,
  },
};
