import type { CharacterCard } from "@tcg/lorcana-types";
import { yaxConcertGoerI18n } from "./008-yax-concert-goer.i18n";

export const yaxConcertGoer: CharacterCard = {
  id: "cuZ",
  canonicalId: "ci_cuZ",
  slug: "lorcana-ci_cuZ",
  printings: [
    {
      id: "set14-008",
      artId: "set14-008",
      setCode: "set14",
      collectorNumber: "8",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-008"],
  cardType: "character",
  name: "Yax",
  version: "Concert Goer",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "014",
  cardNumber: 8,
  rarity: "uncommon",
  cost: 7,
  strength: 7,
  willpower: 9,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_5ea44faad3a04cc39712aa74c159847a",
  },
  classifications: ["Storyborn", "Ally"],
  i18n: yaxConcertGoerI18n,
};
