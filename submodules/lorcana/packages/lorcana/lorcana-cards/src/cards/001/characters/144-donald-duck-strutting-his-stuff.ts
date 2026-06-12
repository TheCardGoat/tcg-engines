import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckStruttingHisStuffI18n } from "./144-donald-duck-strutting-his-stuff.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const donaldDuckStruttingHisStuff: CharacterCard = {
  id: "fpc",
  canonicalId: "ci_fpc",
  reprints: ["set1-144"],
  cardType: "character",
  name: "Donald Duck",
  version: "Strutting His Stuff",
  inkType: ["sapphire"],
  set: "001",
  cardNumber: 144,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_8d5ff9b706fd4f59b44e0ca52638a257",
    tcgPlayer: 503358,
  },
  text: "Ward",
  classifications: ["Dreamborn", "Hero", "Inventor"],
  abilities: [ward],
  i18n: donaldDuckStruttingHisStuffI18n,
};
