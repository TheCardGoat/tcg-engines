import type { CharacterCard } from "@tcg/lorcana-types";
import { robinHoodEphemeralArcher } from "./171-robin-hood-ephemeral-archer";

export const robinHoodEphemeralArcherEpic: CharacterCard = {
  ...robinHoodEphemeralArcher,
  id: "UdH",
  reprints: ["set10-171"],
  set: "010",
  cardNumber: 221,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_9a7e83a63b8444438f4bc7714df6faf9",
    tcgPlayer: 660272,
  },
};
