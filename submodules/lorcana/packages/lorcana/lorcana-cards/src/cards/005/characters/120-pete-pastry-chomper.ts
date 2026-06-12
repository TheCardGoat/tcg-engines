import type { CharacterCard } from "@tcg/lorcana-types";
import { petePastryChomperI18n } from "./120-pete-pastry-chomper.i18n";

export const petePastryChomper: CharacterCard = {
  id: "sSk",
  canonicalId: "ci_sSk",
  reprints: ["set5-120"],
  cardType: "character",
  name: "Pete",
  version: "Pastry Chomper",
  inkType: ["ruby"],
  set: "005",
  cardNumber: 120,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_6351c1cb10e841e09ce43d107309796b",
    tcgPlayer: 561638,
  },
  classifications: ["Storyborn", "Villain"],
  i18n: petePastryChomperI18n,
};
