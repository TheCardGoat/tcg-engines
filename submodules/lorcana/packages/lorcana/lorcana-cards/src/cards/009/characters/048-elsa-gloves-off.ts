import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaGlovesOffI18n } from "./048-elsa-gloves-off.i18n";

import { challenger } from "../../../helpers/abilities/challenger";

export const elsaGlovesOff: CharacterCard = {
  id: "in4",
  canonicalId: "ci_in4",
  slug: "lorcana-ci_in4",
  printings: [
    {
      id: "set9-048",
      artId: "set9-048",
      setCode: "set9",
      collectorNumber: "48",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set2-p1-019", "set2-039", "set9-048"],
  cardType: "character",
  name: "Elsa",
  version: "Gloves Off",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "009",
  cardNumber: 48,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_07b1ad34ad4540b3a65c189dab2dc805",
    tcgPlayer: "649992",
  },
  text: "Challenger +3 (While challenging, this character gets +3 {S})",
  classifications: ["Storyborn", "Hero", "Queen", "Sorcerer"],
  abilities: [challenger(3)],
  i18n: elsaGlovesOffI18n,
};
