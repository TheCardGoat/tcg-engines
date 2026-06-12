import type { CharacterCard } from "@tcg/lorcana-types";
import { arielSonicWarrior as canonicalArielSonicWarrior } from "../../004";

export const arielSonicWarrior: CharacterCard = {
  ...canonicalArielSonicWarrior,
  id: "tG9",
  reprints: ["set4-175", "set9-195"],
  set: "009",
  cardNumber: 195,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_8744600f576e484fa2e93cec672eba2f",
    tcgPlayer: 650128,
  },
};
