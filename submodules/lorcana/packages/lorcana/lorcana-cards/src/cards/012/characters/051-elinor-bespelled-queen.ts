import type { CharacterCard } from "@tcg/lorcana-types";
import { elinorBespelledQueenI18n } from "./051-elinor-bespelled-queen.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const elinorBespelledQueen: CharacterCard = {
  id: "9Ll",
  canonicalId: "ci_9Ll",
  reprints: ["set12-051"],
  cardType: "character",
  name: "Elinor",
  version: "Bespelled Queen",
  inkType: ["amethyst"],
  franchise: "Brave",
  set: "012",
  cardNumber: 51,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0a71c3e50580448eabd6ee24d079ecad",
  },
  text: "Challenger +2",
  classifications: ["Storyborn", "Queen"],
  abilities: [challenger(2)],
  i18n: elinorBespelledQueenI18n,
};
