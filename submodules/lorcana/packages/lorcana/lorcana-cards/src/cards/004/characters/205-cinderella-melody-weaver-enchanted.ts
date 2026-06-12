import type { CharacterCard } from "@tcg/lorcana-types";
import { cinderellaMelodyWeaver } from "./004-cinderella-melody-weaver";

export const cinderellaMelodyWeaverEnchanted: CharacterCard = {
  ...cinderellaMelodyWeaver,
  id: "V2A",
  reprints: ["set4-004"],
  set: "004",
  cardNumber: 205,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_eaf7db4a652b47939bddb0db4c9030e9",
    tcgPlayer: 550544,
  },
};
