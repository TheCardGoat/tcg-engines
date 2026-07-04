import type { CharacterCard } from "@tcg/lorcana-types";
import { meilinLeeLeadVocalist } from "./007-meilin-lee-lead-vocalist";
import { meilinLeeLeadVocalistP4ChallengeI18n } from "./p4-010-meilin-lee-lead-vocalist-challenge.i18n";

export const meilinLeeLeadVocalistP4Challenge: CharacterCard = {
  ...meilinLeeLeadVocalist,
  id: "s3Z",
  printings: [
    {
      id: "set13-p4-010-challenge",
      artId: "ci_EL8-challenge",
      setCode: "set13",
      collectorNumber: "10",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  cardNumber: 10,
  rarity: "special",
  specialRarity: "challenge",
  i18n: meilinLeeLeadVocalistP4ChallengeI18n,
};
