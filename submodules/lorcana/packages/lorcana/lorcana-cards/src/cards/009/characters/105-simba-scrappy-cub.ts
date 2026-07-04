import type { CharacterCard } from "@tcg/lorcana-types";
import { simbaScrappyCubI18n } from "./105-simba-scrappy-cub.i18n";

export const simbaScrappyCub: CharacterCard = {
  id: "sli",
  canonicalId: "ci_WFz",
  slug: "lorcana-ci_WFz",
  printings: [
    {
      id: "set9-105",
      artId: "set9-105",
      setCode: "set9",
      collectorNumber: "105",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set3-123", "set9-105"],
  cardType: "character",
  name: "Simba",
  version: "Scrappy Cub",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "009",
  cardNumber: 105,
  rarity: "rare",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 3,
  inkable: false,
  vanilla: true,
  externalIds: {
    lorcast: "crd_49d30b3074984f9288f650908b3d0654",
    tcgPlayer: "650043",
  },
  classifications: ["Storyborn", "Hero", "Prince"],
  i18n: simbaScrappyCubI18n,
};
