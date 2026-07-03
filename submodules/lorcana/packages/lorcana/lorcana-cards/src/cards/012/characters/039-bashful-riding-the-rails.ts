import type { CharacterCard } from "@tcg/lorcana-types";
import { bashfulRidingTheRailsI18n } from "./039-bashful-riding-the-rails.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const bashfulRidingTheRails: CharacterCard = {
  id: "yQo",
  canonicalId: "ci_yQo",
  slug: "lorcana-ci_yQo",
  printings: [
    {
      id: "set12-039",
      artId: "set12-039",
      setCode: "set12",
      collectorNumber: "39",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-039"],
  cardType: "character",
  name: "Bashful",
  version: "Riding the Rails",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "012",
  cardNumber: 39,
  rarity: "common",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_31942dd851fe4b9cb0ac05388e346987",
    tcgPlayer: "692018",
  },
  text: "Evasive",
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
  abilities: [evasive],
  i18n: bashfulRidingTheRailsI18n,
};
