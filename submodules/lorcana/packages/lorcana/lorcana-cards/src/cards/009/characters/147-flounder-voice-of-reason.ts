import type { CharacterCard } from "@tcg/lorcana-types";
import { flounderVoiceOfReason as canonicalFlounderVoiceOfReason } from "../../001";

export const flounderVoiceOfReason: CharacterCard = {
  ...canonicalFlounderVoiceOfReason,
  id: "e6d",
  reprints: ["set1-145", "set9-147"],
  set: "009",
  cardNumber: 147,
  rarity: "common",
  externalIds: {
    lorcast: "crd_62d32921f32d4504b83949a0c78002e7",
    tcgPlayer: 650082,
  },
};
