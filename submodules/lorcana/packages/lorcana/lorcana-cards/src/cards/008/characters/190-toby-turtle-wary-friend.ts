import type { CharacterCard } from "@tcg/lorcana-types";
import { tobyTurtleWaryFriendI18n } from "./190-toby-turtle-wary-friend.i18n";

export const tobyTurtleWaryFriend: CharacterCard = {
  id: "Qqa",
  canonicalId: "ci_hVZ",
  reprints: ["set8-190"],
  cardType: "character",
  name: "Toby Turtle",
  version: "Wary Friend",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "008",
  cardNumber: 190,
  rarity: "common",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0de5fd56ffa5426c854d2123b28a61c1",
    tcgPlayer: 631772,
  },
  text: [
    {
      title: "HARD SHELL",
      description: "While this character is exerted, he gains Resist +1.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        type: "is-exerted",
      },
      effect: {
        keyword: "Resist",
        target: "SELF",
        type: "gain-keyword",
        value: 1,
      },
      id: "1le-1",
      name: "HARD SHELL",
      text: "HARD SHELL While this character is exerted, he gains Resist +1.",
      type: "static",
    },
  ],
  i18n: tobyTurtleWaryFriendI18n,
};
