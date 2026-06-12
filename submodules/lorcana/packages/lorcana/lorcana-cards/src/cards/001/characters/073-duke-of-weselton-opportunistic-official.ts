import type { CharacterCard } from "@tcg/lorcana-types";
import { dukeOfWeseltonOpportunisticOfficialI18n } from "./073-duke-of-weselton-opportunistic-official.i18n";

export const dukeOfWeseltonOpportunisticOfficial: CharacterCard = {
  id: "vyg",
  canonicalId: "ci_vyg",
  reprints: ["set1-073"],
  cardType: "character",
  name: "Duke of Weselton",
  version: "Opportunistic Official",
  inkType: ["emerald"],
  franchise: "Frozen",
  set: "001",
  cardNumber: 73,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_fb2dc6f12f584032a54f9925f060e059",
    tcgPlayer: 505971,
  },
  classifications: ["Storyborn", "Villain"],
  i18n: dukeOfWeseltonOpportunisticOfficialI18n,
};
