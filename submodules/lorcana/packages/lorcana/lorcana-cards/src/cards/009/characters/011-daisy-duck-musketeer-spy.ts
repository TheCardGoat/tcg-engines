import type { CharacterCard } from "@tcg/lorcana-types";
import { daisyDuckMusketeerSpy as canonicalDaisyDuckMusketeerSpy } from "../../004";

export const daisyDuckMusketeerSpy: CharacterCard = {
  ...canonicalDaisyDuckMusketeerSpy,
  id: "l86",
  reprints: ["set4-007", "set9-011"],
  set: "009",
  cardNumber: 11,
  rarity: "common",
  externalIds: {
    lorcast: "crd_df9fc4392077467ab80211e4c47b6b2c",
    tcgPlayer: 649960,
  },
};
