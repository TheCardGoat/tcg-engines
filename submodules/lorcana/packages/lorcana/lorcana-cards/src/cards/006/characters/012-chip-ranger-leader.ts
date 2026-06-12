import type { CharacterCard } from "@tcg/lorcana-types";
import { chipRangerLeaderI18n } from "./012-chip-ranger-leader.i18n";

export const chipRangerLeader: CharacterCard = {
  id: "kcI",
  canonicalId: "ci_kcI",
  reprints: ["set6-012"],
  cardType: "character",
  name: "Chip",
  version: "Ranger Leader",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "006",
  cardNumber: 12,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_68660de4a81d4426acdb185e3ff4813a",
    tcgPlayer: 578169,
  },
  text: [
    {
      title: "THE VALUE OF FRIENDSHIP",
      description:
        "While you have a character named Dale in play, this character gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      condition: {
        controller: "you",
        name: "Dale",
        type: "has-named-character",
      },
      effect: {
        keyword: "Support",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "1ue-1",
      name: "THE VALUE OF FRIENDSHIP",
      text: "THE VALUE OF FRIENDSHIP While you have a character named Dale in play, this character gains Support.",
      type: "static",
    },
  ],
  i18n: chipRangerLeaderI18n,
};
