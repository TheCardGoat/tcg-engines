import type { CharacterCard } from "@tcg/lorcana-types";
import { annaTruehearted as canonicalAnnaTruehearted } from "../../004";

export const annaTruehearted: CharacterCard = {
  ...canonicalAnnaTruehearted,
  id: "Uqw",
  reprints: ["set4-138", "set9-137"],
  set: "009",
  cardNumber: 137,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_a0dbcc4e038e43ee90773445e70c170c",
    tcgPlayer: 650072,
  },
};
