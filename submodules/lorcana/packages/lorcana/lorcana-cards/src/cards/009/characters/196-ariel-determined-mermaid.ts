import type { CharacterCard } from "@tcg/lorcana-types";
import { arielDeterminedMermaid as canonicalArielDeterminedMermaid } from "../../004";

export const arielDeterminedMermaid: CharacterCard = {
  ...canonicalArielDeterminedMermaid,
  id: "OiN",
  reprints: ["set4-174", "set9-196"],
  set: "009",
  cardNumber: 196,
  rarity: "common",
  externalIds: {
    lorcast: "crd_8e9017b673fa48039cb919188a8dae7a",
    tcgPlayer: 650129,
  },
};
