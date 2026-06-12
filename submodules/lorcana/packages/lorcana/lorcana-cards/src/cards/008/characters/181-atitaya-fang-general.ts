import type { CharacterCard } from "@tcg/lorcana-types";
import { atitayaFangGeneralI18n } from "./181-atitaya-fang-general.i18n";

export const atitayaFangGeneral: CharacterCard = {
  id: "jID",
  canonicalId: "ci_jID",
  reprints: ["set8-181"],
  cardType: "character",
  name: "Atitaya",
  version: "Fang General",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "008",
  cardNumber: 181,
  rarity: "uncommon",
  cost: 7,
  strength: 7,
  willpower: 7,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_a4e5d72ce815494eb8647bbe7aa33454",
    tcgPlayer: 633101,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: atitayaFangGeneralI18n,
};
