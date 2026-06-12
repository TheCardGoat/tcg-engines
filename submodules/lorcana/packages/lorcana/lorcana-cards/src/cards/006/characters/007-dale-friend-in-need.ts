import type { CharacterCard } from "@tcg/lorcana-types";
import { daleFriendInNeedI18n } from "./007-dale-friend-in-need.i18n";

export const daleFriendInNeed: CharacterCard = {
  id: "y2t",
  canonicalId: "ci_y2t",
  reprints: ["set6-007"],
  cardType: "character",
  name: "Dale",
  version: "Friend in Need",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "006",
  cardNumber: 7,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_166f05d54db54c06813b6dbb7693255d",
    tcgPlayer: 578168,
  },
  text: [
    {
      title: "CHIP'S PARTNER",
      description:
        "This character enters play exerted unless you have a character named Chip in play.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      condition: {
        type: "not",
        condition: {
          controller: "you",
          name: "Chip",
          type: "has-named-character",
        },
      },
      effect: {
        restriction: "enters-play-exerted",
        target: "SELF",
        type: "restriction",
      },
      id: "1pa-1",
      name: "CHIP'S PARTNER",
      text: "CHIP'S PARTNER This character enters play exerted unless you have a character named Chip in play.",
      type: "static",
    },
  ],
  i18n: daleFriendInNeedI18n,
};
