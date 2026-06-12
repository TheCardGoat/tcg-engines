import type { CharacterCard } from "@tcg/lorcana-types";
import { arielSonicWarrior } from "./175-ariel-sonic-warrior";

export const arielSonicWarriorEnchanted: CharacterCard = {
  ...arielSonicWarrior,
  id: "oVx",
  reprints: ["set4-175", "set9-195"],
  set: "004",
  cardNumber: 220,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_8744600f576e484fa2e93cec672eba2f",
    tcgPlayer: 650128,
  },
};
