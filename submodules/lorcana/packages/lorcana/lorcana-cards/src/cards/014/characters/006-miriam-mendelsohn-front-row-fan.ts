import type { CharacterCard } from "@tcg/lorcana-types";
import { miriamMendelsohnFrontrowFanI18n } from "./006-miriam-mendelsohn-front-row-fan.i18n";
import { support } from "../../../helpers/abilities/support";

export const miriamMendelsohnFrontrowFan: CharacterCard = {
  id: "gjQ",
  canonicalId: "ci_gjQ",
  slug: "lorcana-ci_gjQ",
  printings: [
    {
      id: "set14-006",
      artId: "set14-006",
      setCode: "set14",
      collectorNumber: "6",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-006"],
  cardType: "character",
  name: "Miriam Mendelsohn",
  version: "Front-Row Fan",
  inkType: ["amber"],
  franchise: "Turning Red",
  set: "014",
  cardNumber: 6,
  rarity: "uncommon",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0c333590c11346f4a50aa8b0c93d88d8",
  },
  text: "Support",
  classifications: ["Storyborn", "Ally"],
  abilities: [support],
  i18n: miriamMendelsohnFrontrowFanI18n,
};
