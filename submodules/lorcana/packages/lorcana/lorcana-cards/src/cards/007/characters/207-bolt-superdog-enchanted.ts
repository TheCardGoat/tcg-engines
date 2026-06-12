import type { CharacterCard } from "@tcg/lorcana-types";
import { boltSuperdog } from "./004-bolt-superdog";

export const boltSuperdogEnchanted: CharacterCard = {
  ...boltSuperdog,
  id: "qNQ",
  reprints: ["set7-004"],
  set: "007",
  cardNumber: 207,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_e8863a1965284a3bad897ee8614d2866",
    tcgPlayer: 619735,
  },
};
