import type { CharacterCard } from "@tcg/lorcana-types";

export const pjPeteCaughtUpInTheMusic: CharacterCard = {
  id: "a30",
  cardType: "character",
  name: "P.J. Pete",
  version: "Caught Up in the Music",
  fullName: "P.J. Pete - Caught Up in the Music",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "009",
  text: "SHOUT OUT LOUD! Whenever you play a song, this character gets +2 {S} this turn.",
  cost: 4,
  strength: 3,
  willpower: 5,
  lore: 1,
  cardNumber: 114,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "24576a183be2edf6bfc1f38f147eb03943d01bdc",
  },
  abilities: [
    {
      id: "a30-1",
      type: "triggered",
      name: "SHOUT OUT LOUD!",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
        duration: "this-turn",
      },
      text: "SHOUT OUT LOUD! Whenever you play a song, this character gets +2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
