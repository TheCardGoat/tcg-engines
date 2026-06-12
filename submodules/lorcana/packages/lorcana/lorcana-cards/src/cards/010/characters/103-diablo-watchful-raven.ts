import type { CharacterCard } from "@tcg/lorcana-types";
import { diabloWatchfulRavenI18n } from "./103-diablo-watchful-raven.i18n";

export const diabloWatchfulRaven: CharacterCard = {
  id: "tM1",
  canonicalId: "ci_tM1",
  reprints: ["set10-103"],
  cardType: "character",
  name: "Diablo",
  version: "Watchful Raven",
  inkType: ["ruby"],
  franchise: "Sleeping Beauty",
  set: "010",
  cardNumber: 103,
  rarity: "rare",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: false,
  vanilla: true,
  externalIds: {
    lorcast: "crd_65729f741f574e078711c5cec14ee087",
    tcgPlayer: 658380,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: diabloWatchfulRavenI18n,
};
