import type { CharacterCard } from "@tcg/lorcana-types";
import { captainHookConcernedCaptainI18n } from "./077-captain-hook-concerned-captain.i18n";

export const captainHookConcernedCaptain: CharacterCard = {
  id: "GBD",
  canonicalId: "ci_GBD",
  slug: "lorcana-ci_GBD",
  printings: [
    {
      id: "set14-077",
      artId: "set14-077",
      setCode: "set14",
      collectorNumber: "77",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-077"],
  cardType: "character",
  name: "Captain Hook",
  version: "Concerned Captain",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "014",
  cardNumber: 77,
  rarity: "uncommon",
  cost: 8,
  strength: 9,
  willpower: 9,
  lore: 3,
  inkable: true,
  vanilla: true,
  classifications: ["Dreamborn", "Villain", "Pirate", "Captain"],
  i18n: captainHookConcernedCaptainI18n,
};
