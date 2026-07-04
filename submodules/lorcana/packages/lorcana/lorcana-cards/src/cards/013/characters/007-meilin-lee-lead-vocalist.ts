import type { CharacterCard } from "@tcg/lorcana-types";
import { meilinLeeLeadVocalistI18n } from "./007-meilin-lee-lead-vocalist.i18n";

import { singer } from "../../../helpers/abilities/singer";

export const meilinLeeLeadVocalist: CharacterCard = {
  id: "EL8",
  canonicalId: "ci_EL8",
  slug: "lorcana-ci_EL8",
  printings: [
    {
      id: "set13-007",
      artId: "set13-007",
      setCode: "set13",
      collectorNumber: "7",
      rarity: "uncommon",
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
  cardNumber: 7,
  rarity: "uncommon",
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
  i18n: meilinLeeLeadVocalistI18n,
};
