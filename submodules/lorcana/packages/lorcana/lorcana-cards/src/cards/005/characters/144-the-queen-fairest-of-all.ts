import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenFairestOfAllI18n } from "./144-the-queen-fairest-of-all.i18n";
import { shift } from "../../../helpers/abilities/shift";
import { ward } from "../../../helpers/abilities/ward";

export const theQueenFairestOfAll: CharacterCard = {
  id: "Wpl",
  canonicalId: "ci_Wpl",
  reprints: ["set5-144"],
  cardType: "character",
  name: "The Queen",
  version: "Fairest of All",
  inkType: ["sapphire"],
  franchise: "Snow White",
  set: "005",
  cardNumber: 144,
  rarity: "common",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_cf5e4f99f9c44d91b44ba607d640173b",
    tcgPlayer: 561967,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "Ward",
    },
    {
      title: "REFLECTIONS OF VANITY",
      description:
        "For each other character named The Queen you have in play, this character gets +1 {L}.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Queen", "Sorcerer"],
  abilities: [
    shift(3),
    ward,
    {
      effect: {
        modifier: {
          name: "The Queen",
          controller: "you",
          excludeSelf: true,
          type: "name-character-count",
        },
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1ho-3",
      name: "REFLECTIONS OF VANITY",
      text: "REFLECTIONS OF VANITY For each other character named The Queen you have in play, this character gets +1 {L}.",
      type: "static",
    },
  ],
  i18n: theQueenFairestOfAllI18n,
};
