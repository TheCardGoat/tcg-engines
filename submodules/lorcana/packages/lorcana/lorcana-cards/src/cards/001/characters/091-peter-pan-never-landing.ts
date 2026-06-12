import type { CharacterCard } from "@tcg/lorcana-types";
import { peterPanNeverLandingI18n } from "./091-peter-pan-never-landing.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const peterPanNeverLanding: CharacterCard = {
  id: "k9e",
  canonicalId: "ci_k9e",
  reprints: ["set1-091"],
  cardType: "character",
  name: "Peter Pan",
  version: "Never Landing",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "001",
  cardNumber: 91,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_91d042c887b54b7098c9044a36816008",
    tcgPlayer: 502535,
  },
  text: "Evasive",
  classifications: ["Dreamborn", "Hero"],
  abilities: [evasive],
  i18n: peterPanNeverLandingI18n,
};
