import type { CharacterCard } from "@tcg/lorcana-types";
import { abuelitaLovingGrandmotherI18n } from "./002-abuelita-loving-grandmother.i18n";

export const abuelitaLovingGrandmother: CharacterCard = {
  id: "Qe1",
  canonicalId: "ci_Qe1",
  slug: "lorcana-ci_Qe1",
  printings: [
    {
      id: "set14-002",
      artId: "set14-002",
      setCode: "set14",
      collectorNumber: "2",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-002"],
  cardType: "character",
  name: "Abuelita",
  version: "Loving Grandmother",
  inkType: ["amber"],
  franchise: "Coco",
  set: "014",
  cardNumber: 2,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  vanilla: true,
  classifications: ["Storyborn", "Ally"],
  i18n: abuelitaLovingGrandmotherI18n,
};
