import type { CharacterCard } from "@tcg/lorcana-types";
import { plutoRescueDog as canonicalPlutoRescueDog } from "../../004";

export const plutoRescueDog: CharacterCard = {
  ...canonicalPlutoRescueDog,
  id: "UIV",
  reprints: ["set4-020", "set9-016"],
  set: "009",
  cardNumber: 16,
  rarity: "common",
  externalIds: {
    lorcast: "crd_e16de0af3ca24eaa9e6570598920d9e8",
    tcgPlayer: 649964,
  },
};
