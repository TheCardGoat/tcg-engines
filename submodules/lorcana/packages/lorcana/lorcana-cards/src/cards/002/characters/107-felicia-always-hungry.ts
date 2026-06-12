import type { CharacterCard } from "@tcg/lorcana-types";
import { feliciaAlwaysHungryI18n } from "./107-felicia-always-hungry.i18n";
import { reckless } from "../../../helpers/abilities/reckless";

export const feliciaAlwaysHungry: CharacterCard = {
  id: "Wz0",
  canonicalId: "ci_Wz0",
  reprints: ["set2-107"],
  cardType: "character",
  name: "Felicia",
  version: "Always Hungry",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "002",
  cardNumber: 107,
  rarity: "common",
  cost: 1,
  strength: 3,
  willpower: 1,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_5898c1f57f914c70880a9a3fee5a4962",
    tcgPlayer: 527755,
  },
  text: "Reckless",
  classifications: ["Dreamborn", "Ally"],
  abilities: [reckless],
  i18n: feliciaAlwaysHungryI18n,
};
