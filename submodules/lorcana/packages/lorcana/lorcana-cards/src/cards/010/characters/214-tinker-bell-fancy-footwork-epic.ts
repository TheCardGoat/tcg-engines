import type { CharacterCard } from "@tcg/lorcana-types";
import { tinkerBellFancyFootworkEpicI18n } from "./214-tinker-bell-fancy-footwork-epic.i18n";

export const tinkerBellFancyFootworkEpic: CharacterCard = {
  id: "uPL",
  canonicalId: "ci_WYX",
  slug: "lorcana-ci_WYX",
  printings: [
    {
      id: "set10-214-epic",
      artId: "ci_WYX-epic",
      setCode: "set10",
      collectorNumber: "214",
      rarity: "epic",
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
  cardNumber: 214,
  rarity: "common",
  specialRarity: "epic",
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
  i18n: tinkerBellFancyFootworkEpicI18n,
};
