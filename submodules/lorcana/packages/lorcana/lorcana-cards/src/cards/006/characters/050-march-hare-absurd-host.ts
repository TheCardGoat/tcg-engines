import type { CharacterCard } from "@tcg/lorcana-types";
import { marchHareAbsurdHostI18n } from "./050-march-hare-absurd-host.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const marchHareAbsurdHost: CharacterCard = {
  id: "don",
  canonicalId: "ci_don",
  reprints: ["set6-050"],
  cardType: "character",
  name: "March Hare",
  version: "Absurd Host",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "006",
  cardNumber: 50,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_dc31d36d626f403b871338da45d0a685",
    tcgPlayer: 588100,
  },
  text: "Rush",
  classifications: ["Storyborn"],
  abilities: [rush],
  i18n: marchHareAbsurdHostI18n,
};
