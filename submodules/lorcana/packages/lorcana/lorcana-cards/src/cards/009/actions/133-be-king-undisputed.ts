import type { ActionCard } from "@tcg/lorcana-types";
import { beKingUndisputed as canonicalBeKingUndisputed } from "../../004";

export const beKingUndisputed: ActionCard = {
  ...canonicalBeKingUndisputed,
  id: "GX9",
  reprints: ["set4-129", "set9-133"],
  set: "009",
  cardNumber: 133,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_d47a329c9f87420c8c2714ea6f7fffde",
    tcgPlayer: 650152,
  },
};
