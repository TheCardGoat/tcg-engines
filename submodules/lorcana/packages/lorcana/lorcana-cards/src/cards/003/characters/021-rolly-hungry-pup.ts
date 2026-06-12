import type { CharacterCard } from "@tcg/lorcana-types";
import { rollyHungryPupI18n } from "./021-rolly-hungry-pup.i18n";
import { support } from "../../../helpers/abilities/support";

export const rollyHungryPup: CharacterCard = {
  id: "5D2",
  canonicalId: "ci_5D2",
  reprints: ["set3-021"],
  cardType: "character",
  name: "Rolly",
  version: "Hungry Pup",
  inkType: ["amber"],
  franchise: "101 Dalmatians",
  set: "003",
  cardNumber: 21,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2e4b186b853e4bd7b5d3144645efd6a1",
    tcgPlayer: 538353,
  },
  text: "Support",
  classifications: ["Storyborn", "Puppy"],
  abilities: [support],
  i18n: rollyHungryPupI18n,
};
