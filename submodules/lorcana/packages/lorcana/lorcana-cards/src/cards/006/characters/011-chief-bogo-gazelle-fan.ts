import type { CharacterCard } from "@tcg/lorcana-types";
import { chiefBogoGazelleFanI18n } from "./011-chief-bogo-gazelle-fan.i18n";

export const chiefBogoGazelleFan: CharacterCard = {
  id: "XdU",
  canonicalId: "ci_XdU",
  reprints: ["set6-011"],
  cardType: "character",
  name: "Chief Bogo",
  version: "Gazelle Fan",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "006",
  cardNumber: 11,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5976c98ec3d145c686c0c1d5042a8ca2",
    tcgPlayer: 593000,
  },
  text: [
    {
      title: "YOU LIKE GAZELLE TOO?",
      description:
        "While you have a character named Gazelle in play, this character gains Singer 6. (He counts as cost 6 to sing songs.)",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      condition: {
        controller: "you",
        name: "Gazelle",
        type: "has-named-character",
      },
      effect: {
        keyword: "Singer",
        target: "SELF",
        type: "gain-keyword",
        value: 6,
      },
      id: "1ud-1",
      name: "YOU LIKE GAZELLE TOO?",
      text: "YOU LIKE GAZELLE TOO? While you have a character named Gazelle in play, this character gains Singer 6.",
      type: "static",
    },
  ],
  i18n: chiefBogoGazelleFanI18n,
};
