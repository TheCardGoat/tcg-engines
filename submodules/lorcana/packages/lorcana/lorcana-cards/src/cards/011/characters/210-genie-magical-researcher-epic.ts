import type { CharacterCard } from "@tcg/lorcana-types";
import { genieMagicalResearcherEpicI18n } from "./210-genie-magical-researcher-epic.i18n";

import { boost } from "../../../helpers/abilities/boost";

export const genieMagicalResearcherEpic: CharacterCard = {
  id: "Erd",
  canonicalId: "ci_PvV",
  slug: "lorcana-ci_PvV",
  printings: [
    {
      id: "set11-210-epic",
      artId: "ci_PvV-epic",
      setCode: "set11",
      collectorNumber: "210",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set11-049"],
  cardType: "character",
  name: "Genie",
  version: "Magical Researcher",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "011",
  cardNumber: 210,
  rarity: "common",
  specialRarity: "epic",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_13f9925099454b7a8fd6225381d11061",
    tcgPlayer: "675280",
  },
  text: "Boost 1 {I} INCREASING WISDOM This character gets +1 {L} for each card under him.",
  classifications: ["Storyborn", "Ally", "Whisper"],
  abilities: [
    boost(1),
    {
      id: "h4v-2",
      name: "INCREASING WISDOM",
      type: "static",
      effect: {
        modifier: {
          type: "cards-under-self",
        },
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      text: "INCREASING WISDOM This character gets +1 {L} for each card under him.",
    },
  ],
  i18n: genieMagicalResearcherEpicI18n,
};
