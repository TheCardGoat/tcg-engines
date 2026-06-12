import type { CharacterCard } from "@tcg/lorcana-types";
import { jafarWickedSorcererI18n } from "./045-jafar-wicked-sorcerer.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const jafarWickedSorcerer: CharacterCard = {
  id: "APi",
  canonicalId: "ci_APi",
  reprints: ["set1-045"],
  cardType: "character",
  name: "Jafar",
  version: "Wicked Sorcerer",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "001",
  cardNumber: 45,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_695cab1b70c24a0289cc2d3c2316dfed",
    tcgPlayer: 494098,
  },
  text: "Challenger +3",
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  abilities: [challenger(3)],
  i18n: jafarWickedSorcererI18n,
};
