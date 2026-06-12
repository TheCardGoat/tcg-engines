import type { CharacterCard } from "@tcg/lorcana-types";
import { gazellePopStarI18n } from "./011-gazelle-pop-star.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const gazellePopStar: CharacterCard = {
  id: "5Ov",
  canonicalId: "ci_5Ov",
  reprints: ["set5-011"],
  cardType: "character",
  name: "Gazelle",
  version: "Pop Star",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "005",
  cardNumber: 11,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_12426744b21049a39b01acf3d93e4311",
    tcgPlayer: 561947,
  },
  text: "Singer 5",
  classifications: ["Storyborn", "Ally"],
  abilities: [singer(5)],
  i18n: gazellePopStarI18n,
};
