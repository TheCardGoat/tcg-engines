import type { CharacterCard } from "@tcg/lorcana-types";
import { basilOfBakerStreetI18n } from "./139-basil-of-baker-street.i18n";

import { support } from "../../../helpers/abilities/support";

export const basilOfBakerStreet: CharacterCard = {
  id: "sCa",
  canonicalId: "ci_sCa",
  slug: "lorcana-ci_sCa",
  printings: [
    {
      id: "set2-139",
      artId: "set2-139",
      setCode: "set2",
      collectorNumber: "139",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set2-139"],
  cardType: "character",
  name: "Basil",
  version: "Of Baker Street",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "002",
  cardNumber: 139,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e820659ebe3f4a2fa154ffae96da8bde",
    tcgPlayer: "525239",
  },
  text: "Support",
  classifications: ["Dreamborn", "Hero", "Detective"],
  abilities: [support],
  i18n: basilOfBakerStreetI18n,
};
