import type { CharacterCard } from "@tcg/lorcana-types";
import { kangaHunnyBardI18n } from "./023-kanga-hunny-bard.i18n";

import { singer } from "../../../helpers/abilities/singer";

export const kangaHunnyBard: CharacterCard = {
  id: "m1n",
  canonicalId: "ci_m1n",
  slug: "lorcana-ci_m1n",
  printings: [
    {
      id: "set13-023",
      artId: "set13-023",
      setCode: "set13",
      collectorNumber: "23",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-023"],
  cardType: "character",
  name: "Kanga",
  version: "Hunny Bard",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "013",
  cardNumber: 23,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_f3f6ae965e3644cd98b6f957b3dad229",
  },
  text: "Singer 5",
  classifications: ["Dreamborn", "Ally", "Hunny"],
  abilities: [singer(5)],
  i18n: kangaHunnyBardI18n,
};
