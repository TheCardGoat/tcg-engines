import type { CharacterCard } from "@tcg/lorcana-types";
import { mamaOdieVoiceOfWisdom as canonicalMamaOdieVoiceOfWisdom } from "../../003";

export const mamaOdieVoiceOfWisdom: CharacterCard = {
  ...canonicalMamaOdieVoiceOfWisdom,
  id: "Udk",
  reprints: ["set3-052", "set9-057"],
  set: "009",
  cardNumber: 57,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_262e1faa79d74ec38f16ba92a9981e54",
    tcgPlayer: 650001,
  },
};
