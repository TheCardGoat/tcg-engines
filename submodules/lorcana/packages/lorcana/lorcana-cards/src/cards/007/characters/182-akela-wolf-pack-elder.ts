import type { CharacterCard } from "@tcg/lorcana-types";
import { akelaWolfPackElderI18n } from "./182-akela-wolf-pack-elder.i18n";

export const akelaWolfPackElder: CharacterCard = {
  id: "uB3",
  canonicalId: "ci_uB3",
  reprints: ["set7-182"],
  cardType: "character",
  name: "Akela",
  version: "Wolf Pack Elder",
  inkType: ["steel"],
  franchise: "Jungle Book",
  set: "007",
  cardNumber: 182,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_b8f203cb54ee40baae13e58050d0c843",
    tcgPlayer: 618713,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: akelaWolfPackElderI18n,
};
