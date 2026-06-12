import type { CharacterCard } from "@tcg/lorcana-types";
import { orvilleAcePilotI18n } from "./013-orville-ace-pilot.i18n";

export const orvilleAcePilot: CharacterCard = {
  id: "Rcs",
  canonicalId: "ci_Rcs",
  reprints: ["set3-013"],
  cardType: "character",
  name: "Orville",
  version: "Ace Pilot",
  inkType: ["amber"],
  franchise: "Rescuers",
  set: "003",
  cardNumber: 13,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_07dfc12012794405ad72a71f1a738c5d",
    tcgPlayer: 539065,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: orvilleAcePilotI18n,
};
