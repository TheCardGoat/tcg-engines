import type { CharacterCard } from "@tcg/lorcana-types";
import { rancisFluggerbutterChocolateChargerI18n } from "./108-rancis-fluggerbutter-chocolate-charger.i18n";

export const rancisFluggerbutterChocolateCharger: CharacterCard = {
  id: "5sW",
  canonicalId: "ci_5sW",
  reprints: ["set5-108"],
  cardType: "character",
  name: "Rancis Fluggerbutter",
  version: "Chocolate Charger",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "005",
  cardNumber: 108,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_ba5b6348c7074d0cb21ecde50a1e6651",
    tcgPlayer: 555266,
  },
  classifications: ["Storyborn", "Ally", "Racer"],
  i18n: rancisFluggerbutterChocolateChargerI18n,
};
