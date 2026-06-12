import type { CharacterCard } from "@tcg/lorcana-types";
import { singer } from "../../../helpers/abilities/singer";
import { shantiVillageGirlI18n } from "./013-shanti-village-girl.i18n";

export const shantiVillageGirl: CharacterCard = {
  id: "x4v",
  canonicalId: "ci_x4v",
  reprints: ["set10-013"],
  cardType: "character",
  name: "Shanti",
  version: "Village Girl",
  inkType: ["amber"],
  franchise: "Jungle Book",
  set: "010",
  cardNumber: 13,
  rarity: "common",
  cost: 3,
  strength: 0,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_656fee63050e47b8aa6d9c9a732ca5a6",
    tcgPlayer: 659179,
  },
  text: "Singer 5",
  classifications: ["Storyborn", "Ally"],
  abilities: [singer(5)],
  i18n: shantiVillageGirlI18n,
};
