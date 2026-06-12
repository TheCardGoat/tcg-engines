import type { CharacterCard } from "@tcg/lorcana-types";
import { snowannaRainbeauCoolCompetitorI18n } from "./110-snowanna-rainbeau-cool-competitor.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const snowannaRainbeauCoolCompetitor: CharacterCard = {
  id: "3sJ",
  canonicalId: "ci_3sJ",
  reprints: ["set5-110"],
  cardType: "character",
  name: "Snowanna Rainbeau",
  version: "Cool Competitor",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "005",
  cardNumber: 110,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_0af4496693f64685885b27455c69e385",
    tcgPlayer: 555268,
  },
  text: "Rush",
  classifications: ["Storyborn", "Ally", "Racer"],
  abilities: [rush],
  i18n: snowannaRainbeauCoolCompetitorI18n,
};
