import type { CharacterCard } from "@tcg/lorcana-types";
import { idunaAlarmedQueenI18n } from "./113-iduna-alarmed-queen.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const idunaAlarmedQueen: CharacterCard = {
  id: "whR",
  canonicalId: "ci_HXk",
  reprints: ["set11-113"],
  cardType: "character",
  name: "Iduna",
  version: "Alarmed Queen",
  inkType: ["ruby"],
  franchise: "Frozen",
  set: "011",
  cardNumber: 113,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_d79f18fa0da949079077eb5ecaad8426",
    tcgPlayer: 675499,
  },
  text: "Evasive",
  classifications: ["Storyborn", "Mentor", "Queen"],
  abilities: [evasive],
  i18n: idunaAlarmedQueenI18n,
};
