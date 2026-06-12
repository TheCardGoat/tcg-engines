import type { CharacterCard } from "@tcg/lorcana-types";
import { rayaKumandranRider } from "./107-raya-kumandran-rider";

export const rayaKumandranRiderEnchanted: CharacterCard = {
  ...rayaKumandranRider,
  id: "pyb",
  reprints: ["set6-107"],
  set: "006",
  cardNumber: 214,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_b1ea1c67fc224e968a4906149590585c",
    tcgPlayer: 592036,
  },
};
