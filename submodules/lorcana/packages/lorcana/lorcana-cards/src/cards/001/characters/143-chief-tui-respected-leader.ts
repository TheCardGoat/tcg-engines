import type { CharacterCard } from "@tcg/lorcana-types";
import { chiefTuiRespectedLeaderI18n } from "./143-chief-tui-respected-leader.i18n";
import { support } from "../../../helpers/abilities/support";

export const chiefTuiRespectedLeader: CharacterCard = {
  id: "DmB",
  canonicalId: "ci_DmB",
  reprints: ["set1-143"],
  cardType: "character",
  name: "Chief Tui",
  version: "Respected Leader",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "001",
  cardNumber: 143,
  rarity: "uncommon",
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_2bd7564121d5445ab350345c91a45ef4",
    tcgPlayer: 508819,
  },
  text: "Support",
  classifications: ["Storyborn", "Mentor", "King"],
  abilities: [support],
  i18n: chiefTuiRespectedLeaderI18n,
};
