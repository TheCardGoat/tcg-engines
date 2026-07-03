import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckVinelingRiderI18n } from "./124-donald-duck-vineling-rider.i18n";

import { rush } from "../../../helpers/abilities/rush";

export const donaldDuckVinelingRider: CharacterCard = {
  id: "dDv",
  canonicalId: "ci_dDv",
  slug: "lorcana-ci_dDv",
  printings: [
    {
      id: "set13-124",
      artId: "set13-124",
      setCode: "set13",
      collectorNumber: "124",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-124"],
  cardType: "character",
  name: "Donald Duck",
  version: "Vineling Rider",
  inkType: ["ruby"],
  set: "013",
  cardNumber: 124,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  text: "<Rush>",
  classifications: ["Storyborn", "Ally"],
  abilities: [rush],
  i18n: donaldDuckVinelingRiderI18n,
};
