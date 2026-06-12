import type { CharacterCard } from "@tcg/lorcana-types";
import { arthurNoviceSparrowI18n } from "./121-arthur-novice-sparrow.i18n";
import { reckless } from "../../../helpers/abilities/reckless";

export const arthurNoviceSparrow: CharacterCard = {
  id: "WQv",
  canonicalId: "ci_WQv",
  reprints: ["set5-121"],
  cardType: "character",
  name: "Arthur",
  version: "Novice Sparrow",
  inkType: ["ruby"],
  franchise: "Sword in the Stone",
  set: "005",
  cardNumber: 121,
  rarity: "uncommon",
  cost: 1,
  strength: 2,
  willpower: 3,
  lore: 0,
  inkable: false,
  externalIds: {
    lorcast: "crd_51db72cea0fc47c7a261bea9f511d4eb",
    tcgPlayer: 561466,
  },
  text: "Reckless",
  classifications: ["Storyborn", "Hero"],
  abilities: [reckless],
  i18n: arthurNoviceSparrowI18n,
};
