import type { CharacterCard } from "@tcg/lorcana-types";
import { sisuEmpoweredSibling } from "./125-sisu-empowered-sibling";

export const sisuEmpoweredSiblingEnchanted: CharacterCard = {
  ...sisuEmpoweredSibling,
  id: "VLy",
  reprints: ["set4-125"],
  set: "004",
  cardNumber: 215,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_d0714091b2a14f478e2d7704c8eb50d8",
    tcgPlayer: 550839,
  },
};
