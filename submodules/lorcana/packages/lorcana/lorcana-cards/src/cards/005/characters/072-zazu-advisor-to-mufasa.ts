import type { CharacterCard } from "@tcg/lorcana-types";
import { zazuAdvisorToMufasaI18n } from "./072-zazu-advisor-to-mufasa.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const zazuAdvisorToMufasa: CharacterCard = {
  id: "M8t",
  canonicalId: "ci_M8t",
  reprints: ["set5-072"],
  cardType: "character",
  name: "Zazu",
  version: "Advisor to Mufasa",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "005",
  cardNumber: 72,
  rarity: "common",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_e069dd79b4104043aab51cde64808d82",
    tcgPlayer: 561497,
  },
  text: "Evasive",
  classifications: ["Storyborn", "Ally"],
  abilities: [evasive],
  i18n: zazuAdvisorToMufasaI18n,
};
