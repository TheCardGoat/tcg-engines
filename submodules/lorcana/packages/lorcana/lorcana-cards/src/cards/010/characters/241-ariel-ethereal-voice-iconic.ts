import type { CharacterCard } from "@tcg/lorcana-types";
import { arielEtherealVoice } from "./017-ariel-ethereal-voice";

export const arielEtherealVoiceIconic: CharacterCard = {
  ...arielEtherealVoice,
  id: "P7j",
  reprints: ["set10-017"],
  set: "010",
  cardNumber: 241,
  rarity: "common",
  specialRarity: "iconic",
  externalIds: {
    lorcast: "crd_5b53a4c5b3854ab0ba71dd388aaa0d9f",
    tcgPlayer: 657885,
  },
};
