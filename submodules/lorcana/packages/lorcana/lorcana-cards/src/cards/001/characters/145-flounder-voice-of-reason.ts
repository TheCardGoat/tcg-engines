import type { CharacterCard } from "@tcg/lorcana-types";
import { flounderVoiceOfReasonI18n } from "./145-flounder-voice-of-reason.i18n";

export const flounderVoiceOfReason: CharacterCard = {
  id: "6YW",
  canonicalId: "ci_nWw",
  reprints: ["set1-145", "set9-147"],
  cardType: "character",
  name: "Flounder",
  version: "Voice of Reason",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "001",
  cardNumber: 145,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_62d32921f32d4504b83949a0c78002e7",
    tcgPlayer: 650082,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: flounderVoiceOfReasonI18n,
};
