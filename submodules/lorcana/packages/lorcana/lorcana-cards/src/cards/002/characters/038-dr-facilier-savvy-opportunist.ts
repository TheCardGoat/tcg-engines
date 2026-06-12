import type { CharacterCard } from "@tcg/lorcana-types";
import { drFacilierSavvyOpportunistI18n } from "./038-dr-facilier-savvy-opportunist.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const drFacilierSavvyOpportunist: CharacterCard = {
  id: "25Q",
  canonicalId: "ci_25Q",
  reprints: ["set2-038"],
  cardType: "character",
  name: "Dr. Facilier",
  version: "Savvy Opportunist",
  inkType: ["amethyst"],
  franchise: "Princess and the Frog",
  set: "002",
  cardNumber: 38,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_bb645060d48e4242b0003701c6b27400",
    tcgPlayer: 527731,
  },
  text: "Evasive",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [evasive],
  i18n: drFacilierSavvyOpportunistI18n,
};
