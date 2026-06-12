import type { CharacterCard } from "@tcg/lorcana-types";
import { auroraDreamingGuardian as canonicalAuroraDreamingGuardian } from "../../001";

export const auroraDreamingGuardian: CharacterCard = {
  ...canonicalAuroraDreamingGuardian,
  id: "klx",
  reprints: ["set1-139", "set9-153"],
  set: "009",
  cardNumber: 153,
  rarity: "common",
  externalIds: {
    lorcast: "crd_81f418041acd4fd98990e02403938de4",
    tcgPlayer: 650088,
  },
};
