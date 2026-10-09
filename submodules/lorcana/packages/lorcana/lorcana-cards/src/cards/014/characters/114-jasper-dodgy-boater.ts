import type { CharacterCard } from "@tcg/lorcana-types";
import { jasperDodgyBoaterI18n } from "./114-jasper-dodgy-boater.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const jasperDodgyBoater: CharacterCard = {
  id: "gR3",
  canonicalId: "ci_gR3",
  slug: "lorcana-ci_gR3",
  printings: [
    {
      id: "set14-114",
      artId: "set14-114",
      setCode: "set14",
      collectorNumber: "114",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-114"],
  cardType: "character",
  name: "Jasper",
  version: "Dodgy Boater",
  inkType: ["ruby"],
  franchise: "101 Dalmatians",
  set: "014",
  cardNumber: 114,
  rarity: "uncommon",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_e9fa2f6fc89d48adbf00d7f510de863f",
  },
  text: "Evasive",
  classifications: ["Storyborn", "Ally"],
  abilities: [evasive],
  i18n: jasperDodgyBoaterI18n,
};
