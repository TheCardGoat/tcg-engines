import type { CharacterCard } from "@tcg/lorcana-types";
import { genieOnTheJob } from "./075-genie-on-the-job";

export const genieOnTheJobEnchanted: CharacterCard = {
  ...genieOnTheJob,
  id: "Qdl",
  reprints: ["set1-075"],
  set: "001",
  cardNumber: 209,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_ae7e91462bfc4861bbf97e99ed53a1c1",
    tcgPlayer: 510155,
  },
};
