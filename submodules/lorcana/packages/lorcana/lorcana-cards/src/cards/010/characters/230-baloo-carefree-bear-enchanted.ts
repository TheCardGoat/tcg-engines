import type { CharacterCard } from "@tcg/lorcana-types";
import { balooCarefreeBear } from "./085-baloo-carefree-bear";

export const balooCarefreeBearEnchanted: CharacterCard = {
  ...balooCarefreeBear,
  id: "19k",
  reprints: ["set10-085"],
  set: "010",
  cardNumber: 230,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_9a1c82a2d3dd4ef898fb86f089242018",
    tcgPlayer: 659443,
  },
};
