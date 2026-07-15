import type { CharacterCard } from "@tcg/lorcana-types";
import { peterPanVineDuelistI18n } from "./131-peter-pan-vine-duelist.i18n";

export const peterPanVineDuelist: CharacterCard = {
  id: "W1X",
  canonicalId: "ci_W1X",
  slug: "lorcana-ci_W1X",
  printings: [
    {
      id: "set13-131",
      artId: "set13-131",
      setCode: "set13",
      collectorNumber: "131",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-131"],
  cardType: "character",
  name: "Peter Pan",
  version: "Vine Duelist",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "013",
  cardNumber: 131,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_b9337a2b2efc45c6afaaa31f2623de46",
  },
  classifications: ["Storyborn", "Hero"],
  i18n: peterPanVineDuelistI18n,
};
