import type { CharacterCard } from "@tcg/lorcana-types";
import { missBiancaRescueAidSocietyAgentI18n } from "./010-miss-bianca-rescue-aid-society-agent.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const missBiancaRescueAidSocietyAgent: CharacterCard = {
  id: "psy",
  canonicalId: "ci_psy",
  reprints: ["set3-010"],
  cardType: "character",
  name: "Miss Bianca",
  version: "Rescue Aid Society Agent",
  inkType: ["amber"],
  franchise: "Rescuers",
  set: "003",
  cardNumber: 10,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a2bdf443390f4009bed7f162badd841c",
    tcgPlayer: 539063,
  },
  text: "Singer 4",
  classifications: ["Storyborn", "Hero"],
  abilities: [singer(4)],
  i18n: missBiancaRescueAidSocietyAgentI18n,
};
