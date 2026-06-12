import type { CharacterCard } from "@tcg/lorcana-types";
import { agustinMadrigalClumsyDadI18n } from "./001-agustin-madrigal-clumsy-dad.i18n";

export const agustinMadrigalClumsyDad: CharacterCard = {
  id: "pkE",
  canonicalId: "ci_pkE",
  reprints: ["set4-001"],
  cardType: "character",
  name: "Agustin Madrigal",
  version: "Clumsy Dad",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "004",
  cardNumber: 1,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_80c9df6d04f94ccab3df1e24619e21a3",
    tcgPlayer: 549618,
  },
  classifications: ["Storyborn", "Mentor", "Madrigal"],
  i18n: agustinMadrigalClumsyDadI18n,
};
