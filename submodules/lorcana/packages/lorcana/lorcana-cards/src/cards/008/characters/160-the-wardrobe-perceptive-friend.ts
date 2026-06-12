import type { CharacterCard } from "@tcg/lorcana-types";
import { theWardrobePerceptiveFriendI18n } from "./160-the-wardrobe-perceptive-friend.i18n";

export const theWardrobePerceptiveFriend: CharacterCard = {
  id: "MRR",
  canonicalId: "ci_MRR",
  reprints: ["set8-160"],
  cardType: "character",
  name: "The Wardrobe",
  version: "Perceptive Friend",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "008",
  cardNumber: 160,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_00a8d41f53554e5b9151021f4bd59f41",
    tcgPlayer: 631457,
  },
  text: [
    {
      title: "I HAVE JUST THE THING!",
      description: "{E}, Choose and discard an item card — Draw 2 cards.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "s0r-1",
      name: "I HAVE JUST THE THING!",
      text: "I HAVE JUST THE THING! {E}, Choose and discard an item card — Draw 2 cards.",
      type: "activated",
      cost: {
        exert: true,
        discardCards: 1,
        discardChosen: true,
        discardCardType: "item",
      },
      effect: {
        amount: 2,
        target: "CONTROLLER",
        type: "draw",
      },
    },
  ],
  i18n: theWardrobePerceptiveFriendI18n,
};
