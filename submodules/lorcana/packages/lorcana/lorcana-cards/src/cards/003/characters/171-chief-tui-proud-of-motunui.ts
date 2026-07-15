import type { CharacterCard } from "@tcg/lorcana-types";
import { chiefTuiProudOfMotunuiI18n } from "./171-chief-tui-proud-of-motunui.i18n";

export const chiefTuiProudOfMotunui: CharacterCard = {
  id: "a46",
  canonicalId: "ci_a46",
  slug: "lorcana-ci_a46",
  printings: [
    {
      id: "set3-171",
      artId: "set3-171",
      setCode: "set3",
      collectorNumber: "171",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set3-171"],
  cardType: "character",
  name: "Chief Tui",
  version: "Proud of Motunui",
  inkType: ["steel"],
  franchise: "Moana",
  set: "003",
  cardNumber: 171,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_5646a42f0a98475ba7c07e55f7cb47df",
    tcgPlayer: "538328",
  },
  classifications: ["Storyborn", "Mentor", "King"],
  i18n: chiefTuiProudOfMotunuiI18n,
};
