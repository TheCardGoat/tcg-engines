import type { CharacterCard } from "@tcg/lorcana-types";
import { daleExcitedFriendI18n } from "./004-dale-excited-friend.i18n";

export const daleExcitedFriend: CharacterCard = {
  id: "CQL",
  canonicalId: "ci_CQL",
  reprints: ["set12-004"],
  cardType: "character",
  name: "Dale",
  version: "Excited Friend",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "012",
  cardNumber: 4,
  rarity: "common",
  cost: 3,
  strength: 1,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_06e1e4bd136e4a5b8cd9c93e478f2c4f",
  },
  text: [
    {
      title: "LOOK WHAT",
      description:
        "I FOUND While you have a character named Chip in play, this character gets +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "CQL-1",
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      condition: {
        type: "has-named-character",
        controller: "you",
        name: "Chip",
      },
      name: "LOOK WHAT I FOUND",
      type: "static",
      text: "LOOK WHAT I FOUND While you have a character named Chip in play, this character gets +1 {L}.",
    },
  ],
  i18n: daleExcitedFriendI18n,
};
