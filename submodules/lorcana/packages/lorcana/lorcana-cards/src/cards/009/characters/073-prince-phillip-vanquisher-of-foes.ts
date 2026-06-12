import type { CharacterCard } from "@tcg/lorcana-types";
import { princePhillipVanquisherOfFoes as canonicalPrincePhillipVanquisherOfFoes } from "../../004";

export const princePhillipVanquisherOfFoes: CharacterCard = {
  ...canonicalPrincePhillipVanquisherOfFoes,
  id: "5fm",
  reprints: ["set4-087", "set9-073"],
  set: "009",
  cardNumber: 73,
  rarity: "common",
  externalIds: {
    lorcast: "crd_4c762e16709149b79b4f7d895fd1de8b",
    tcgPlayer: 650015,
  },
};
