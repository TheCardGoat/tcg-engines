import type { CharacterCard } from "@tcg/lorcana-types";
import { jasmineHeirOfAgrabah as canonicalJasmineHeirOfAgrabah } from "../../002";

export const jasmineHeirOfAgrabah: CharacterCard = {
  ...canonicalJasmineHeirOfAgrabah,
  id: "vNP",
  reprints: ["set2-151", "set9-155"],
  set: "009",
  cardNumber: 155,
  rarity: "common",
  externalIds: {
    lorcast: "crd_76abbf408f4940dea3dc5daf5afdd314",
    tcgPlayer: 650090,
  },
};
