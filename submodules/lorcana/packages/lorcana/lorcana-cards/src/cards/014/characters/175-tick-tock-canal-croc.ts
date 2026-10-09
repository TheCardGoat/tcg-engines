import type { CharacterCard } from "@tcg/lorcana-types";
import { ticktockCanalCrocI18n } from "./175-tick-tock-canal-croc.i18n";

export const ticktockCanalCroc: CharacterCard = {
  id: "ruw",
  canonicalId: "ci_ruw",
  slug: "lorcana-ci_ruw",
  printings: [
    {
      id: "set14-175",
      artId: "set14-175",
      setCode: "set14",
      collectorNumber: "175",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-175"],
  cardType: "character",
  name: "Tick-Tock",
  version: "Canal Croc",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "014",
  cardNumber: 175,
  rarity: "uncommon",
  cost: 8,
  strength: 9,
  willpower: 9,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_a60684a0d1ce41dcb69db19d9bec01c7",
  },
  classifications: ["Storyborn"],
  i18n: ticktockCanalCrocI18n,
};
