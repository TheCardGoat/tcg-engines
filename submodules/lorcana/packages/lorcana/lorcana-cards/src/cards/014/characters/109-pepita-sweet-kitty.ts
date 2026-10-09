import type { CharacterCard } from "@tcg/lorcana-types";
import { pepitaSweetKittyI18n } from "./109-pepita-sweet-kitty.i18n";

export const pepitaSweetKitty: CharacterCard = {
  id: "6CV",
  canonicalId: "ci_6CV",
  slug: "lorcana-ci_6CV",
  printings: [
    {
      id: "set14-109",
      artId: "set14-109",
      setCode: "set14",
      collectorNumber: "109",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-109"],
  cardType: "character",
  name: "Pepita",
  version: "Sweet Kitty",
  inkType: ["ruby"],
  franchise: "Coco",
  set: "014",
  cardNumber: 109,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  classifications: ["Storyborn", "Ally"],
  i18n: pepitaSweetKittyI18n,
};
