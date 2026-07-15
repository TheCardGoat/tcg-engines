import type { CharacterCard } from "@tcg/lorcana-types";
import { hadesKingOfOlympusEnchantedI18n } from "./205-hades-king-of-olympus-enchanted.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const hadesKingOfOlympusEnchanted: CharacterCard = {
  id: "6dK",
  canonicalId: "ci_pZ2",
  slug: "lorcana-ci_pZ2",
  printings: [
    {
      id: "set1-205-enchanted",
      artId: "ci_pZ2-enchanted",
      setCode: "set1",
      collectorNumber: "205",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set1-005"],
  cardType: "character",
  name: "Hades",
  version: "King of Olympus",
  inkType: ["amber"],
  franchise: "Hercules",
  set: "001",
  cardNumber: 205,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 8,
  strength: 6,
  willpower: 7,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_a9c86e6316084d76a03b32be95977091",
    tcgPlayer: "510148",
  },
  text: [
    {
      title: "Shift 6",
    },
    {
      title: "SINISTER PLOT",
      description: "This character gets +1 {L} for each other Villain character you have in play.",
    },
  ],
  classifications: ["Floodborn", "Villain", "King", "Deity"],
  abilities: [
    shift(6),
    {
      effect: {
        modifier: {
          classification: "Villain",
          controller: "you",
          type: "classification-character-count",
          excludeSelf: true,
        },
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1e5-2",
      name: "SINISTER PLOT",
      text: "SINISTER PLOT This character gets +1 {L} for each other Villain character you have in play.",
      type: "static",
    },
  ],
  i18n: hadesKingOfOlympusEnchantedI18n,
};
