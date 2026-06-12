import type { CharacterCard } from "@tcg/lorcana-types";
import { thePrinceNeverGivesUpI18n } from "./195-the-prince-never-gives-up.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";
import { resist } from "../../../helpers/abilities/resist";

export const thePrinceNeverGivesUp: CharacterCard = {
  id: "jp9",
  canonicalId: "ci_jp9",
  reprints: ["set2-195"],
  cardType: "character",
  name: "The Prince",
  version: "Never Gives Up",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "002",
  cardNumber: 195,
  rarity: "uncommon",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_9cc22e72ff234c27acb37f7d0e1f4441",
    tcgPlayer: 517607,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "Resist +1",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince"],
  abilities: [bodyguard, resist(1)],
  i18n: thePrinceNeverGivesUpI18n,
};
