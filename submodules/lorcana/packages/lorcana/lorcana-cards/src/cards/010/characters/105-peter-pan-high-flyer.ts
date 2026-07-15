import type { CharacterCard } from "@tcg/lorcana-types";
import { peterPanHighFlyerI18n } from "./105-peter-pan-high-flyer.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const peterPanHighFlyer: CharacterCard = {
  id: "MnK",
  canonicalId: "ci_MnK",
  slug: "lorcana-ci_MnK",
  printings: [
    {
      id: "set10-105",
      artId: "set10-105",
      setCode: "set10",
      collectorNumber: "105",
      rarity: "common",
      imageUrl: "",
    },
  ],
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
    tcgPlayer: "659189",
  },
  text: "Evasive",
  classifications: ["Storyborn", "Hero"],
  abilities: [evasive],
  i18n: peterPanHighFlyerI18n,
};
