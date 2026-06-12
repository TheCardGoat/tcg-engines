import type { CharacterCard } from "@tcg/lorcana-types";
import { evasive } from "../../../helpers/abilities/evasive";
import { peterPanHighFlyerI18n } from "./105-peter-pan-high-flyer.i18n";

export const peterPanHighFlyer: CharacterCard = {
  id: "MnK",
  canonicalId: "ci_MnK",
  reprints: ["set10-105"],
  cardType: "character",
  name: "Peter Pan",
  version: "High Flyer",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "010",
  cardNumber: 105,
  rarity: "common",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_9868e624b438444a9cdf1f4ef0878547",
    tcgPlayer: 659189,
  },
  text: "Evasive",
  classifications: ["Storyborn", "Hero"],
  abilities: [evasive],
  i18n: peterPanHighFlyerI18n,
};
