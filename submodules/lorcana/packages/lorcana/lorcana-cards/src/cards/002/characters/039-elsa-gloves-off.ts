import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaGlovesOffI18n } from "./039-elsa-gloves-off.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const elsaGlovesOff: CharacterCard = {
  id: "oOJ",
  canonicalId: "ci_ZXZ",
  reprints: ["set2-039", "set9-048"],
  cardType: "character",
  name: "Elsa",
  version: "Gloves Off",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "002",
  cardNumber: 39,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_07b1ad34ad4540b3a65c189dab2dc805",
    tcgPlayer: 649992,
  },
  text: "Challenger +3",
  classifications: ["Storyborn", "Hero", "Queen", "Sorcerer"],
  abilities: [challenger(3)],
  i18n: elsaGlovesOffI18n,
};
