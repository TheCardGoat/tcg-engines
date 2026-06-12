import type { CharacterCard } from "@tcg/lorcana-types";
import { figaroTuxedoCatI18n } from "./133-figaro-tuxedo-cat.i18n";

export const figaroTuxedoCat: CharacterCard = {
  id: "Nrd",
  canonicalId: "ci_Nrd",
  reprints: ["set8-133"],
  cardType: "character",
  name: "Figaro",
  version: "Tuxedo Cat",
  inkType: ["ruby"],
  franchise: "Pinocchio",
  set: "008",
  cardNumber: 133,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9da6ba4d41244f61b558bc6a63a93ec3",
    tcgPlayer: 632714,
  },
  text: [
    {
      title: "PLAYFULNESS",
      description: "Opposing items enter play exerted.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        restriction: "enters-play-exerted",
        target: "ALL_OPPOSING_ITEMS",
        type: "restriction",
      },
      id: "1w3-1",
      name: "PLAYFULNESS",
      text: "PLAYFULNESS Opposing items enter play exerted.",
      type: "static",
    },
  ],
  i18n: figaroTuxedoCatI18n,
};
