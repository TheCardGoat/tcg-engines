import type { CharacterCard } from "@tcg/lorcana-types";
import { pepitaWatchfulAlebrijeI18n } from "./040-pepita-watchful-alebrije.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const pepitaWatchfulAlebrije: CharacterCard = {
  id: "j6r",
  canonicalId: "ci_j6r",
  slug: "lorcana-ci_j6r",
  printings: [
    {
      id: "set14-040",
      artId: "set14-040",
      setCode: "set14",
      collectorNumber: "40",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-040"],
  cardType: "character",
  name: "Pepita",
  version: "Watchful Alebrije",
  inkType: ["amethyst"],
  franchise: "Coco",
  set: "014",
  cardNumber: 40,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  text: "Challenger +2",
  classifications: ["Storyborn", "Ally"],
  abilities: [challenger(2)],
  i18n: pepitaWatchfulAlebrijeI18n,
};
