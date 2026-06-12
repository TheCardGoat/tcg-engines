import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaIceArtisan } from "./123-elsa-ice-artisan";

export const elsaIceArtisanEnchanted: CharacterCard = {
  ...elsaIceArtisan,
  id: "t58",
  reprints: ["set11-123"],
  set: "011",
  cardNumber: 233,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_b35b509f95d441c1bd11ec67d755db5d",
    tcgPlayer: 675515,
  },
};
