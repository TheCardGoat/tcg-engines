import type { CharacterCard } from "@tcg/lorcana-types";
import { rudyGrooveDisrupterI18n } from "./174-rudy-groove-disrupter.i18n";

export const rudyGrooveDisrupter: CharacterCard = {
  id: "SOG",
  canonicalId: "ci_SOG",
  reprints: ["set5-174"],
  cardType: "character",
  name: "Rudy",
  version: "Groove Disrupter",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "005",
  cardNumber: 174,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_74b0d91817074173a048a42d0835275d",
    tcgPlayer: 559791,
  },
  classifications: ["Storyborn"],
  i18n: rudyGrooveDisrupterI18n,
};
