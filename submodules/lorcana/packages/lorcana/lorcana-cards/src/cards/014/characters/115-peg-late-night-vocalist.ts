import type { CharacterCard } from "@tcg/lorcana-types";
import { pegLatenightVocalistI18n } from "./115-peg-late-night-vocalist.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const pegLatenightVocalist: CharacterCard = {
  id: "QLT",
  canonicalId: "ci_QLT",
  slug: "lorcana-ci_QLT",
  printings: [
    {
      id: "set14-115",
      artId: "set14-115",
      setCode: "set14",
      collectorNumber: "115",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-115"],
  cardType: "character",
  name: "Peg",
  version: "Late-Night Vocalist",
  inkType: ["ruby"],
  franchise: "Lady and the Tramp",
  set: "014",
  cardNumber: 115,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  text: "Singer 4",
  classifications: ["Storyborn", "Ally"],
  abilities: [singer(4)],
  i18n: pegLatenightVocalistI18n,
};
