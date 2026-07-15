import type { CharacterCard } from "@tcg/lorcana-types";
import { tinkerBellFancyFootworkI18n } from "./106-tinker-bell-fancy-footwork.i18n";

export const tinkerBellFancyFootwork: CharacterCard = {
  id: "ibL",
  canonicalId: "ci_WYX",
  slug: "lorcana-ci_WYX",
  printings: [
    {
      id: "set10-106",
      artId: "set10-106",
      setCode: "set10",
      collectorNumber: "106",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set10-106"],
  cardType: "character",
  name: "Tinker Bell",
  version: "Fancy Footwork",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "010",
  cardNumber: 106,
  rarity: "common",
  cost: 1,
  strength: 3,
  willpower: 1,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_1eeb3d6d93bf4e228fafce3b3d4cdcff",
    tcgPlayer: "660268",
  },
  classifications: ["Storyborn", "Ally", "Fairy"],
  i18n: tinkerBellFancyFootworkI18n,
};
