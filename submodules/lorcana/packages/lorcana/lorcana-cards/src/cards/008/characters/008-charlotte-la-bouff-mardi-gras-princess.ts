import type { CharacterCard } from "@tcg/lorcana-types";
import { charlotteLaBouffMardiGrasPrincessI18n } from "./008-charlotte-la-bouff-mardi-gras-princess.i18n";

export const charlotteLaBouffMardiGrasPrincess: CharacterCard = {
  id: "M8z",
  canonicalId: "ci_M8z",
  reprints: ["set8-008"],
  cardType: "character",
  name: "Charlotte La Bouff",
  version: "Mardi Gras Princess",
  inkType: ["amber"],
  franchise: "Princess and the Frog",
  set: "008",
  cardNumber: 8,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_6183fa48800b4b52b6a5e81f473dee3b",
    tcgPlayer: 631693,
  },
  classifications: ["Storyborn", "Ally", "Princess"],
  i18n: charlotteLaBouffMardiGrasPrincessI18n,
};
