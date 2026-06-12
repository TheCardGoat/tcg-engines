import type { CharacterCard } from "@tcg/lorcana-types";
import { peterPanFearlessFighterI18n } from "./119-peter-pan-fearless-fighter.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const peterPanFearlessFighter: CharacterCard = {
  id: "1O4",
  canonicalId: "ci_1O4",
  reprints: ["set1-119"],
  cardType: "character",
  name: "Peter Pan",
  version: "Fearless Fighter",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "001",
  cardNumber: 119,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_7f4cc9a32a834ebabaeaea3407d06dbc",
    tcgPlayer: 508787,
  },
  text: "Rush",
  classifications: ["Storyborn", "Hero"],
  abilities: [rush],
  i18n: peterPanFearlessFighterI18n,
};
