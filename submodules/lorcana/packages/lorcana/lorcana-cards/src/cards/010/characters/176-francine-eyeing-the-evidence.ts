import type { CharacterCard } from "@tcg/lorcana-types";
import { resist } from "../../../helpers/abilities/resist";
import { francineEyeingTheEvidenceI18n } from "./176-francine-eyeing-the-evidence.i18n";

export const francineEyeingTheEvidence: CharacterCard = {
  id: "tji",
  canonicalId: "ci_tji",
  reprints: ["set10-176"],
  cardType: "character",
  name: "Francine",
  version: "Eyeing the Evidence",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "010",
  cardNumber: 176,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3a814a78339d4df290966005abc1a5e4",
    tcgPlayer: 659422,
  },
  text: "Resist +1",
  classifications: ["Storyborn", "Ally", "Detective"],
  abilities: [resist(1)],
  i18n: francineEyeingTheEvidenceI18n,
};
