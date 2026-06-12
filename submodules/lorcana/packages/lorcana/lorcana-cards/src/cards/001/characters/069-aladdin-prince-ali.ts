import type { CharacterCard } from "@tcg/lorcana-types";
import { aladdinPrinceAliI18n } from "./069-aladdin-prince-ali.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const aladdinPrinceAli: CharacterCard = {
  id: "QEo",
  canonicalId: "ci_D8z",
  reprints: ["set1-069", "set9-092"],
  cardType: "character",
  name: "Aladdin",
  version: "Prince Ali",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "001",
  cardNumber: 69,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_24ef95291e2f4379983568b7c01974ff",
    tcgPlayer: 650031,
  },
  text: "Ward",
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [ward],
  i18n: aladdinPrinceAliI18n,
};
