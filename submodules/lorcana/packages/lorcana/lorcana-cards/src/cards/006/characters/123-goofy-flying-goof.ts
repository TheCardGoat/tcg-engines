import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyFlyingGoofI18n } from "./123-goofy-flying-goof.i18n";

import { rush } from "../../../helpers/abilities/rush";
import { evasive } from "../../../helpers/abilities/evasive";

export const goofyFlyingGoof: CharacterCard = {
  id: "GQo",
  canonicalId: "ci_GQo",
  slug: "lorcana-ci_GQo",
  printings: [
    {
      id: "set6-123",
      artId: "set6-123",
      setCode: "set6",
      collectorNumber: "123",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set6-123"],
  cardType: "character",
  name: "Goofy",
  version: "Flying Goof",
  inkType: ["ruby"],
  set: "006",
  cardNumber: 123,
  rarity: "rare",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_bb6785f344ac4b43812ed03ffe3793af",
    tcgPlayer: "593008",
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [rush, evasive],
  i18n: goofyFlyingGoofI18n,
};
