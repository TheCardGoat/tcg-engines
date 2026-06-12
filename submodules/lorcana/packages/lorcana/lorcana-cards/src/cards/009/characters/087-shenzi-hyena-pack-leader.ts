import type { CharacterCard } from "@tcg/lorcana-types";
import { shenziHyenaPackLeader as canonicalShenziHyenaPackLeader } from "../../003";

export const shenziHyenaPackLeader: CharacterCard = {
  ...canonicalShenziHyenaPackLeader,
  id: "JHY",
  reprints: ["set3-085", "set9-087"],
  set: "009",
  cardNumber: 87,
  rarity: "common",
  externalIds: {
    lorcast: "crd_b082a2cb0d9f4c24a54a8ebb85f6b0a6",
    tcgPlayer: 650027,
  },
};
