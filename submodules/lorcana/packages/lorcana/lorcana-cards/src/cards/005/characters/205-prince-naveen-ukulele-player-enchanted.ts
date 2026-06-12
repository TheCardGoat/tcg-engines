import type { CharacterCard } from "@tcg/lorcana-types";
import { princeNaveenUkulelePlayer } from "./003-prince-naveen-ukulele-player";

export const princeNaveenUkulelePlayerEnchanted: CharacterCard = {
  ...princeNaveenUkulelePlayer,
  id: "SoY",
  reprints: ["set5-003"],
  set: "005",
  cardNumber: 205,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_74f050d47ef34391ba29b8c521450dac",
    tcgPlayer: 561993,
  },
};
