import type { CharacterCard } from "@tcg/lorcana-types";
import { cruellaDeVilDodgingTrafficI18n } from "./113-cruella-de-vil-dodging-traffic.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const cruellaDeVilDodgingTraffic: CharacterCard = {
  id: "xel",
  canonicalId: "ci_xel",
  slug: "lorcana-ci_xel",
  printings: [
    {
      id: "set14-113",
      artId: "set14-113",
      setCode: "set14",
      collectorNumber: "113",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-113"],
  cardType: "character",
  name: "Cruella De Vil",
  version: "Dodging Traffic",
  inkType: ["ruby"],
  franchise: "101 Dalmatians",
  set: "014",
  cardNumber: 113,
  rarity: "common",
  cost: 6,
  strength: 5,
  willpower: 6,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_cebe8d1dd11346229448528a32124471",
  },
  text: "Rush",
  classifications: ["Storyborn", "Villain"],
  abilities: [rush],
  i18n: cruellaDeVilDodgingTrafficI18n,
};
