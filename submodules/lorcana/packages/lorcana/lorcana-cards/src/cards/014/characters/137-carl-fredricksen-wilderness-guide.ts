import type { CharacterCard } from "@tcg/lorcana-types";
import { carlFredricksenWildernessGuideI18n } from "./137-carl-fredricksen-wilderness-guide.i18n";

export const carlFredricksenWildernessGuide: CharacterCard = {
  id: "n4y",
  canonicalId: "ci_n4y",
  slug: "lorcana-ci_n4y",
  printings: [
    {
      id: "set14-137",
      artId: "set14-137",
      setCode: "set14",
      collectorNumber: "137",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-137"],
  cardType: "character",
  name: "Carl Fredricksen",
  version: "Wilderness Guide",
  inkType: ["sapphire"],
  franchise: "Up",
  set: "014",
  cardNumber: 137,
  rarity: "common",
  cost: 6,
  strength: 5,
  willpower: 6,
  lore: 3,
  inkable: true,
  vanilla: true,
  classifications: ["Dreamborn", "Hero"],
  i18n: carlFredricksenWildernessGuideI18n,
};
