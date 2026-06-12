import type { CharacterCard } from "@tcg/lorcana-types";
import { herculesClumsyKidI18n } from "./108-hercules-clumsy-kid.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const herculesClumsyKid: CharacterCard = {
  id: "6ct",
  canonicalId: "ci_6ct",
  reprints: ["set4-108"],
  cardType: "character",
  name: "Hercules",
  version: "Clumsy Kid",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "004",
  cardNumber: 108,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_606b261078744cc8819ce42293651b88",
    tcgPlayer: 547702,
  },
  text: "Rush",
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [rush],
  i18n: herculesClumsyKidI18n,
};
