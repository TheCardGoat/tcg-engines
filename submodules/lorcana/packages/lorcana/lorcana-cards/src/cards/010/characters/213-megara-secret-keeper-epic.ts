import type { CharacterCard } from "@tcg/lorcana-types";
import { megaraSecretKeeper } from "./086-megara-secret-keeper";

export const megaraSecretKeeperEpic: CharacterCard = {
  ...megaraSecretKeeper,
  id: "Sa5",
  reprints: ["set10-086"],
  set: "010",
  cardNumber: 213,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_78c11305e1674d348fe8839940f029a5",
    tcgPlayer: 658217,
  },
};
