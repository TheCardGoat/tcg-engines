import type { CharacterCard } from "@tcg/lorcana-types";
import { scarVengefulLion } from "./093-scar-vengeful-lion";

export const scarVengefulLionEnchanted: CharacterCard = {
  ...scarVengefulLion,
  id: "gpM",
  reprints: ["set5-093"],
  set: "005",
  cardNumber: 212,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_e382f2cee40343d7ae3faed897045a66",
    tcgPlayer: 561980,
  },
};
