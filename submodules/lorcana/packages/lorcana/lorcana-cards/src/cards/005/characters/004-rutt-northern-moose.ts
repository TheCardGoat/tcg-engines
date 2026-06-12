import type { CharacterCard } from "@tcg/lorcana-types";
import { ruttNorthernMooseI18n } from "./004-rutt-northern-moose.i18n";
import { support } from "../../../helpers/abilities/support";

export const ruttNorthernMoose: CharacterCard = {
  id: "6Ic",
  canonicalId: "ci_6Ic",
  reprints: ["set5-004"],
  cardType: "character",
  name: "Rutt",
  version: "Northern Moose",
  inkType: ["amber"],
  franchise: "Brother Bear",
  set: "005",
  cardNumber: 4,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_db3ade6d337c4c72aad63938a16e7692",
    tcgPlayer: 560498,
  },
  text: "Support",
  classifications: ["Storyborn", "Ally"],
  abilities: [support],
  i18n: ruttNorthernMooseI18n,
};
