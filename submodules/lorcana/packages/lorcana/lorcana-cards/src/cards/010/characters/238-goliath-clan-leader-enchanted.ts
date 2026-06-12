import type { CharacterCard } from "@tcg/lorcana-types";
import { goliathClanLeader } from "./173-goliath-clan-leader";

export const goliathClanLeaderEnchanted: CharacterCard = {
  ...goliathClanLeader,
  id: "wwB",
  reprints: ["set10-173"],
  set: "010",
  cardNumber: 238,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_8941521977e54d6fa2baaae91d13fb6e",
    tcgPlayer: 660035,
  },
};
