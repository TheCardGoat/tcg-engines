import type { CharacterCard } from "@tcg/lorcana-types";
import { genieTheEverImpressiveI18n } from "./077-genie-the-ever-impressive.i18n";

export const genieTheEverImpressive: CharacterCard = {
  id: "5U3",
  canonicalId: "ci_5U3",
  reprints: ["set1-077"],
  cardType: "character",
  name: "Genie",
  version: "The Ever Impressive",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "001",
  cardNumber: 77,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_64d94b7ad8e84bac909438767e1e63af",
    tcgPlayer: 507515,
  },
  classifications: ["Dreamborn", "Ally"],
  i18n: genieTheEverImpressiveI18n,
};
