import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaGlovesOffP1I18n } from "./p1-019-elsa-gloves-off.i18n";

import { challenger } from "../../../helpers/abilities/challenger";

export const elsaGlovesOffP1: CharacterCard = {
  id: "pCk",
  canonicalId: "ci_in4",
  slug: "lorcana-ci_in4",
  printings: [
    {
      id: "set2-p1-019",
      artId: "set2-p1-019",
      setCode: "set2",
      collectorNumber: "19",
      rarity: "special",
      imageUrl: "",
    },
  ],
  reprints: ["set2-p1-019", "set2-039", "set9-048"],
  cardType: "character",
  name: "Elsa",
  version: "Gloves Off",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "002",
  cardNumber: 19,
  rarity: "special",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_07b1ad34ad4540b3a65c189dab2dc805",
    tcgPlayer: "649992",
  },
  text: "<Challenger> +3",
  classifications: ["Storyborn", "Hero", "Queen", "Sorcerer"],
  abilities: [challenger(3)],
  i18n: elsaGlovesOffP1I18n,
};
