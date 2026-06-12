import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseStandardBearer as canonicalMickeyMouseStandardBearer } from "../../004";

export const mickeyMouseStandardBearer: CharacterCard = {
  ...canonicalMickeyMouseStandardBearer,
  id: "obc",
  reprints: ["set4-188", "set9-185"],
  set: "009",
  cardNumber: 185,
  rarity: "common",
  externalIds: {
    lorcast: "crd_a78a6d864bae48dca06ed1dc25e75e3f",
    tcgPlayer: 650156,
  },
};
