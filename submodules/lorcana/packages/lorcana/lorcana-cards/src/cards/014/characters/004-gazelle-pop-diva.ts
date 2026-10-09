import type { CharacterCard } from "@tcg/lorcana-types";
import { gazellePopDivaI18n } from "./004-gazelle-pop-diva.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const gazellePopDiva: CharacterCard = {
  id: "eeA",
  canonicalId: "ci_eeA",
  slug: "lorcana-ci_eeA",
  printings: [
    {
      id: "set14-004",
      artId: "set14-004",
      setCode: "set14",
      collectorNumber: "4",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-004"],
  cardType: "character",
  name: "Gazelle",
  version: "Pop Diva",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "014",
  cardNumber: 4,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: false,
  text: "Singer 4",
  classifications: ["Dreamborn", "Ally"],
  abilities: [singer(4)],
  i18n: gazellePopDivaI18n,
};
