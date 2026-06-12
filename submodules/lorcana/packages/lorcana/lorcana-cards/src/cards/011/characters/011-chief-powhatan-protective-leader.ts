import type { CharacterCard } from "@tcg/lorcana-types";
import { chiefPowhatanProtectiveLeaderI18n } from "./011-chief-powhatan-protective-leader.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const chiefPowhatanProtectiveLeader: CharacterCard = {
  id: "9DJ",
  canonicalId: "ci_9DJ",
  reprints: ["set11-011"],
  cardType: "character",
  name: "Chief Powhatan",
  version: "Protective Leader",
  inkType: ["amber"],
  franchise: "Pocahontas",
  set: "011",
  cardNumber: 11,
  rarity: "uncommon",
  cost: 4,
  strength: 5,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4b12af84da2444928667b6d356a70766",
    tcgPlayer: 676186,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "STANDS HIS GROUND",
      description: "This character can't challenge.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "King"],
  abilities: [
    bodyguard,
    {
      id: "cpl-2",
      effect: {
        restriction: "cant-challenge",
        target: "SELF",
        type: "restriction",
      },
      name: "STANDS HIS GROUND",
      type: "static",
      text: "STANDS HIS GROUND This character can't challenge.",
    },
  ],
  i18n: chiefPowhatanProtectiveLeaderI18n,
};
