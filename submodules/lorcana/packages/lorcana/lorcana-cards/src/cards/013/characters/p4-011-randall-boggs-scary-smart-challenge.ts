import type { CharacterCard } from "@tcg/lorcana-types";
import { randallBoggsScarySmart } from "./153-randall-boggs-scary-smart";
import { randallBoggsScarySmartP4ChallengeI18n } from "./p4-011-randall-boggs-scary-smart-challenge.i18n";

export const randallBoggsScarySmartP4Challenge: CharacterCard = {
  ...randallBoggsScarySmart,
  id: "Eyk",
  printings: [
    {
      id: "set13-p4-011-challenge",
      artId: "ci_ioe-challenge",
      setCode: "set13",
      collectorNumber: "11",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  cardNumber: 11,
  rarity: "special",
  specialRarity: "challenge",
  i18n: randallBoggsScarySmartP4ChallengeI18n,
};
