import type { CharacterCard } from "@tcg/lorcana-types";
import { chernabogEvildoer } from "./003-chernabog-evildoer";

export const chernabogEvildoerEnchanted: CharacterCard = {
  ...chernabogEvildoer,
  id: "thO",
  reprints: ["set3-003"],
  set: "003",
  cardNumber: 205,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_7a288d030d1a471fbb818ccfdddc6052",
    tcgPlayer: 539156,
  },
};
