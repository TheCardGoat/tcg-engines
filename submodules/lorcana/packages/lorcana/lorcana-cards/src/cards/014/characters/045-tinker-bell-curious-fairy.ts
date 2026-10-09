import type { CharacterCard } from "@tcg/lorcana-types";
import { tinkerBellCuriousFairyI18n } from "./045-tinker-bell-curious-fairy.i18n";

export const tinkerBellCuriousFairy: CharacterCard = {
  id: "jhs",
  canonicalId: "ci_jhs",
  slug: "lorcana-ci_jhs",
  printings: [
    {
      id: "set14-045",
      artId: "set14-045",
      setCode: "set14",
      collectorNumber: "45",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-045"],
  cardType: "character",
  name: "Tinker Bell",
  version: "Curious Fairy",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "014",
  cardNumber: 45,
  rarity: "common",
  cost: 1,
  strength: 0,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_b6223f3b5919418fa0552be0f42207ea",
  },
  classifications: ["Storyborn", "Ally", "Fairy"],
  i18n: tinkerBellCuriousFairyI18n,
};
