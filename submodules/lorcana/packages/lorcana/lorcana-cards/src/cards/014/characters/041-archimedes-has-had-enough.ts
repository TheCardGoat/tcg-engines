import type { CharacterCard } from "@tcg/lorcana-types";
import { archimedesHasHadEnoughI18n } from "./041-archimedes-has-had-enough.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const archimedesHasHadEnough: CharacterCard = {
  id: "gzW",
  canonicalId: "ci_gzW",
  slug: "lorcana-ci_gzW",
  printings: [
    {
      id: "set14-041",
      artId: "set14-041",
      setCode: "set14",
      collectorNumber: "41",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-041"],
  cardType: "character",
  name: "Archimedes",
  version: "Has Had Enough",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 41,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  text: "Evasive",
  classifications: ["Storyborn", "Ally"],
  abilities: [evasive],
  i18n: archimedesHasHadEnoughI18n,
};
