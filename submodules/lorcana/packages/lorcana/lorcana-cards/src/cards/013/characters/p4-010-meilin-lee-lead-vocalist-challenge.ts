import type { CharacterCard } from "@tcg/lorcana-types";
import { meilinLeeLeadVocalistP4ChallengeI18n } from "./p4-010-meilin-lee-lead-vocalist-challenge.i18n";

import { singer } from "../../../helpers/abilities/singer";

export const meilinLeeLeadVocalistP4Challenge: CharacterCard = {
  id: "s3Z",
  canonicalId: "ci_EL8",
  slug: "lorcana-ci_EL8",
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
  reprints: ["set13-007"],
  cardType: "character",
  name: "Meilin Lee",
  version: "Lead Vocalist",
  inkType: ["amber"],
  franchise: "Turning Red",
  set: "013",
  cardNumber: 10,
  rarity: "special",
  specialRarity: "challenge",
  cost: 1,
  strength: 0,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7fafc72db65c4609a156954510ee3dbc",
  },
  text: [
    {
      title: "Singer 3",
    },
    {
      title: "BAND LOYALTY",
      description: "This character can't sing songs without Sing Together.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Red Panda"],
  abilities: [
    singer(3),
    {
      type: "static",
      name: "BAND LOYALTY",
      text: "BAND LOYALTY This character can't sing songs without Sing Together.",
      effect: {
        type: "restriction",
        restriction: "cant-sing-without-sing-together",
        target: "SELF",
      },
    },
  ],
  i18n: meilinLeeLeadVocalistP4ChallengeI18n,
};
