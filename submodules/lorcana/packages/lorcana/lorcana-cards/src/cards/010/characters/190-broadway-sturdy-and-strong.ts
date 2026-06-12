import type { CharacterCard } from "@tcg/lorcana-types";
import { broadwaySturdyAndStrongI18n } from "./190-broadway-sturdy-and-strong.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";
import { stoneByDay } from "../../../helpers/abilities/stoneByDay";

export const broadwaySturdyAndStrong: CharacterCard = {
  id: "y1f",
  canonicalId: "ci_y1f",
  reprints: ["set10-190"],
  cardType: "character",
  name: "Broadway",
  version: "Sturdy and Strong",
  inkType: ["steel"],
  franchise: "Gargoyles",
  set: "010",
  cardNumber: 190,
  rarity: "uncommon",
  cost: 5,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_63132ee7ba1f4847a88e67273e1714fa",
    tcgPlayer: 658294,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "STONE BY DAY",
      description: "If you have 3 or more cards in your hand, this character can't ready.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Gargoyle"],
  abilities: [bodyguard, stoneByDay],
  i18n: broadwaySturdyAndStrongI18n,
};
