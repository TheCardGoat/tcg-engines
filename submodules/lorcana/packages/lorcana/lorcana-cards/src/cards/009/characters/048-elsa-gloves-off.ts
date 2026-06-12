import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaGlovesOff as canonicalElsaGlovesOff } from "../../002";

export const elsaGlovesOff: CharacterCard = {
  ...canonicalElsaGlovesOff,
  id: "Cbk",
  reprints: ["set2-039", "set9-048"],
  set: "009",
  cardNumber: 48,
  rarity: "common",
  externalIds: {
    lorcast: "crd_07b1ad34ad4540b3a65c189dab2dc805",
    tcgPlayer: 649992,
  },
};
