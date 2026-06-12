import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseStylishSurferI18n } from "./113-minnie-mouse-stylish-surfer.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const minnieMouseStylishSurfer: CharacterCard = {
  id: "7jJ",
  canonicalId: "ci_7jJ",
  reprints: ["set2-113"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Stylish Surfer",
  inkType: ["ruby"],
  set: "002",
  cardNumber: 113,
  rarity: "uncommon",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_bce37cc08d944fb99b90fa9f6fcda16d",
    tcgPlayer: 526358,
  },
  text: "Evasive",
  classifications: ["Dreamborn", "Hero"],
  abilities: [evasive],
  i18n: minnieMouseStylishSurferI18n,
};
