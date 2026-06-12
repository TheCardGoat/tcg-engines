import type { CharacterCard } from "@tcg/lorcana-types";
import { hansNobleScoundrel as canonicalHansNobleScoundrel } from "../../004";

export const hansNobleScoundrel: CharacterCard = {
  ...canonicalHansNobleScoundrel,
  id: "ylY",
  reprints: ["set4-146", "set9-148"],
  set: "009",
  cardNumber: 148,
  rarity: "common",
  externalIds: {
    lorcast: "crd_34956960ca9c4048b6d2887bb9ca7446",
    tcgPlayer: 650083,
  },
};
