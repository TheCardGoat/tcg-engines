import type { ActionCard } from "@tcg/lorcana-types";
import { fourDozenEggs as canonicalFourDozenEggs } from "../../002";

export const fourDozenEggs: ActionCard = {
  ...canonicalFourDozenEggs,
  id: "wvC",
  reprints: ["set2-163", "set9-164"],
  set: "009",
  cardNumber: 164,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_afa9023a2aeb4569bad0116e638821fa",
    tcgPlayer: 650098,
  },
};
