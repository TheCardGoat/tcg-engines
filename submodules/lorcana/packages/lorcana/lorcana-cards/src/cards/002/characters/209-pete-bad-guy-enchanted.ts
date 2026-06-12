import type { CharacterCard } from "@tcg/lorcana-types";
import { peteBadGuy } from "./088-pete-bad-guy";

export const peteBadGuyEnchanted: CharacterCard = {
  ...peteBadGuy,
  id: "sz4",
  reprints: ["set2-088"],
  set: "002",
  cardNumber: 209,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_67714955a33e4508913f44b8ccb08e5c",
    tcgPlayer: 528108,
  },
};
