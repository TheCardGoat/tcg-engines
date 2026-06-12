import type { CharacterCard } from "@tcg/lorcana-types";
import { thePrinceVigilantSuitorI18n } from "./024-the-prince-vigilant-suitor.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const thePrinceVigilantSuitor: CharacterCard = {
  id: "cGm",
  canonicalId: "ci_cGm",
  reprints: ["set7-024"],
  cardType: "character",
  name: "The Prince",
  version: "Vigilant Suitor",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "007",
  cardNumber: 24,
  rarity: "uncommon",
  cost: 2,
  strength: 0,
  willpower: 5,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_a661b0191f2d40ef8622c751bee7c0c5",
    tcgPlayer: 619419,
  },
  text: "Bodyguard",
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [bodyguard],
  i18n: thePrinceVigilantSuitorI18n,
};
