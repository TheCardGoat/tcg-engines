import type { CharacterCard } from "@tcg/lorcana-types";
import { diabloDevotedHerald } from "./070-diablo-devoted-herald";

export const diabloDevotedHeraldEnchanted: CharacterCard = {
  ...diabloDevotedHerald,
  id: "03s",
  reprints: ["set4-070"],
  set: "004",
  cardNumber: 211,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_93ab5d88940f4610a375a928963a570f",
    tcgPlayer: 550535,
  },
};
