import type { CharacterCard } from "@tcg/lorcana-types";
import { fixitFelixJrNicelandStewardI18n } from "./012-fix-it-felix-jr-niceland-steward.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const fixitFelixJrNicelandSteward: CharacterCard = {
  id: "zoW",
  canonicalId: "ci_zoW",
  reprints: ["set5-012"],
  cardType: "character",
  name: "Fix-It Felix, Jr.",
  version: "Niceland Steward",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "005",
  cardNumber: 12,
  rarity: "uncommon",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_894f1b97871342e29b414e927dcd1140",
    tcgPlayer: 559773,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "BUILDING TOGETHER",
      description: "Your locations get +2 {W}.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    shift(3),
    {
      effect: {
        modifier: 2,
        stat: "willpower",
        target: "YOUR_LOCATIONS",
        type: "modify-stat",
      },
      id: "z1m-2",
      name: "BUILDING TOGETHER",
      text: "BUILDING TOGETHER Your locations get +2 {W}.",
      type: "static",
    },
  ],
  i18n: fixitFelixJrNicelandStewardI18n,
};
