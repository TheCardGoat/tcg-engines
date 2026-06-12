import type { CharacterCard } from "@tcg/lorcana-types";
import { mrsBeakleyFormerShushAgentI18n } from "./011-mrs-beakley-former-shush-agent.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const mrsBeakleyFormerShushAgent: CharacterCard = {
  id: "13A",
  canonicalId: "ci_13A",
  reprints: ["set10-011"],
  cardType: "character",
  name: "Mrs. Beakley",
  version: "Former S.H.U.S.H. Agent",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 11,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a935c6ef1e2c459e8f5ae49d95c044b2",
    tcgPlayer: 658441,
  },
  text: "Bodyguard",
  classifications: ["Storyborn", "Ally"],
  abilities: [bodyguard],
  i18n: mrsBeakleyFormerShushAgentI18n,
};
