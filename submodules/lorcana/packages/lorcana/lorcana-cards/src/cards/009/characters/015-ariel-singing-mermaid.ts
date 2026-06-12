import type { CharacterCard } from "@tcg/lorcana-types";
import { arielSingingMermaid as canonicalArielSingingMermaid } from "../../004";

export const arielSingingMermaid: CharacterCard = {
  ...canonicalArielSingingMermaid,
  id: "h0r",
  reprints: ["set4-003", "set9-015"],
  set: "009",
  cardNumber: 15,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_4b656001901d4c34829cfe124d5c166b",
    tcgPlayer: 647652,
  },
};
