import type { CharacterCard } from "@tcg/lorcana-types";
import { lawrenceJealousManservant as canonicalLawrenceJealousManservant } from "../../002";

export const lawrenceJealousManservant: CharacterCard = {
  ...canonicalLawrenceJealousManservant,
  id: "BUx",
  reprints: ["set2-186", "set9-187"],
  set: "009",
  cardNumber: 187,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_9cba34a84bf04721aefd09dc1e87cb3a",
    tcgPlayer: 650120,
  },
};
