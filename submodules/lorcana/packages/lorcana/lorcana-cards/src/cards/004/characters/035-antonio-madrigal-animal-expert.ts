import type { CharacterCard } from "@tcg/lorcana-types";
import { antonioMadrigalAnimalExpertI18n } from "./035-antonio-madrigal-animal-expert.i18n";

export const antonioMadrigalAnimalExpert: CharacterCard = {
  id: "PrU",
  canonicalId: "ci_PrU",
  reprints: ["set4-035"],
  cardType: "character",
  name: "Antonio Madrigal",
  version: "Animal Expert",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "004",
  cardNumber: 35,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_bf3808fbbb364067a497257398cf353d",
    tcgPlayer: 550521,
  },
  classifications: ["Storyborn", "Ally", "Madrigal"],
  i18n: antonioMadrigalAnimalExpertI18n,
};
