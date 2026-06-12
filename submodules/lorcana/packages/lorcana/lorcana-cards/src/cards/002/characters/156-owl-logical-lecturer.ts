import type { CharacterCard } from "@tcg/lorcana-types";
import { owlLogicalLecturerI18n } from "./156-owl-logical-lecturer.i18n";

export const owlLogicalLecturer: CharacterCard = {
  id: "S4z",
  canonicalId: "ci_S4z",
  reprints: ["set2-156"],
  cardType: "character",
  name: "Owl",
  version: "Logical Lecturer",
  inkType: ["sapphire"],
  franchise: "Winnie the Pooh",
  set: "002",
  cardNumber: 156,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_c60b5558ee6c404f8cdf7955d1087b10",
    tcgPlayer: 527278,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: owlLogicalLecturerI18n,
};
