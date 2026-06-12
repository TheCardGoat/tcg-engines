import type { CharacterCard } from "@tcg/lorcana-types";
import { boltSuperdog } from "./004-bolt-superdog";

export const boltSuperdogEpic: CharacterCard = {
  ...boltSuperdog,
  id: "VBj",
  reprints: ["set7-004"],
  set: "007",
  cardNumber: 223,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_e8863a1965284a3bad897ee8614d2866",
    tcgPlayer: 619735,
  },
};
