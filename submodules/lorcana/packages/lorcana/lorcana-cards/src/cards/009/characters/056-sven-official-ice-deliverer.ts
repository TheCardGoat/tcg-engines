import type { CharacterCard } from "@tcg/lorcana-types";
import { svenOfficialIceDeliverer as canonicalSvenOfficialIceDeliverer } from "../../001";

export const svenOfficialIceDeliverer: CharacterCard = {
  ...canonicalSvenOfficialIceDeliverer,
  id: "GzC",
  reprints: ["set1-055", "set9-056"],
  set: "009",
  cardNumber: 56,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_7b8e4758284944abbee5ba2f79d2b353",
    tcgPlayer: 650000,
  },
};
