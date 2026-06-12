import type { CharacterCard } from "@tcg/lorcana-types";
import { dellaDuckUnstoppableMomI18n } from "./106-della-duck-unstoppable-mom.i18n";
import { reckless } from "../../../helpers/abilities/reckless";

export const dellaDuckUnstoppableMom: CharacterCard = {
  id: "EO7",
  canonicalId: "ci_EO7",
  reprints: ["set3-106"],
  cardType: "character",
  name: "Della Duck",
  version: "Unstoppable Mom",
  inkType: ["ruby"],
  franchise: "Ducktales",
  set: "003",
  cardNumber: 106,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 0,
  inkable: false,
  externalIds: {
    lorcast: "crd_97817cbd2b964970b24740509392cf7b",
    tcgPlayer: 535723,
  },
  text: "Reckless",
  classifications: ["Storyborn", "Ally"],
  abilities: [reckless],
  i18n: dellaDuckUnstoppableMomI18n,
};
