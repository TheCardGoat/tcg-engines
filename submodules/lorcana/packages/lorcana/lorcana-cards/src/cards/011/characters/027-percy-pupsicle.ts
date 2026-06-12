import type { CharacterCard } from "@tcg/lorcana-types";
import { percyPupsicleI18n } from "./027-percy-pupsicle.i18n";

export const percyPupsicle: CharacterCard = {
  id: "0V8",
  canonicalId: "ci_0V8",
  reprints: ["set11-027"],
  cardType: "character",
  name: "Percy",
  version: "Pupsicle",
  inkType: ["amber"],
  franchise: "Pocahontas",
  set: "011",
  cardNumber: 27,
  rarity: "common",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_1a61d954f0524416a6c0f46814520495",
    tcgPlayer: 674830,
  },
  text: [
    {
      title: "ICE BATH",
      description: "This character can't challenge.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "v8p-1",
      effect: {
        restriction: "cant-challenge",
        target: "SELF",
        type: "restriction",
      },
      type: "static",
      name: "ICE BATH",
      text: "ICE BATH This character can't challenge.",
    },
  ],
  i18n: percyPupsicleI18n,
};
