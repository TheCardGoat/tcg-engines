import type { CharacterCard } from "@tcg/lorcana-types";
import { perditaDeterminedMother } from "./027-perdita-determined-mother";

export const perditaDeterminedMotherEnchanted: CharacterCard = {
  ...perditaDeterminedMother,
  id: "RxC",
  reprints: ["set8-027"],
  set: "008",
  cardNumber: 207,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_db4137ebc57046a3ba7736adbdb01d44",
    tcgPlayer: 632686,
  },
};
