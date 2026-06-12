import type { CharacterCard } from "@tcg/lorcana-types";
import { balooLaidbackBearI18n } from "./069-baloo-laid-back-bear.i18n";

export const balooLaidbackBear: CharacterCard = {
  id: "Ji1",
  canonicalId: "ci_Ji1",
  reprints: ["set10-069"],
  cardType: "character",
  name: "Baloo",
  version: "Laid-Back Bear",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "010",
  cardNumber: 69,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_d7134801fdd04fb6bf20166667a14f20",
    tcgPlayer: 659450,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: balooLaidbackBearI18n,
};
