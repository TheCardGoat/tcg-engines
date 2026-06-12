import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenCruelestOfAllI18n } from "./139-the-queen-cruelest-of-all.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const theQueenCruelestOfAll: CharacterCard = {
  id: "W5f",
  canonicalId: "ci_W5f",
  reprints: ["set5-139"],
  cardType: "character",
  name: "The Queen",
  version: "Cruelest of All",
  inkType: ["sapphire"],
  franchise: "Snow White",
  set: "005",
  cardNumber: 139,
  rarity: "common",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_bc6df0ab3743447f9498d36c8f51fe73",
    tcgPlayer: 561641,
  },
  text: "Ward",
  classifications: ["Storyborn", "Villain", "Queen", "Sorcerer"],
  abilities: [ward],
  i18n: theQueenCruelestOfAllI18n,
};
