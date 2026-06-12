import type { CharacterCard } from "@tcg/lorcana-types";
import { genieOfTheLamp } from "./076-genie-of-the-lamp";

export const genieOfTheLampEnchanted: CharacterCard = {
  ...genieOfTheLamp,
  id: "NlV",
  reprints: ["set9-076"],
  set: "009",
  cardNumber: 229,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_aed92d8e19b14ef19a92fb436dde357c",
    tcgPlayer: 651118,
  },
};
