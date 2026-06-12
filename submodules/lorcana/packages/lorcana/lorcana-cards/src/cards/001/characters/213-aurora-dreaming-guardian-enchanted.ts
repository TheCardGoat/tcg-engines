import type { CharacterCard } from "@tcg/lorcana-types";
import { auroraDreamingGuardian } from "./139-aurora-dreaming-guardian";

export const auroraDreamingGuardianEnchanted: CharacterCard = {
  ...auroraDreamingGuardian,
  id: "P5F",
  reprints: ["set1-139", "set9-153"],
  set: "001",
  cardNumber: 213,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_81f418041acd4fd98990e02403938de4",
    tcgPlayer: 650088,
  },
};
