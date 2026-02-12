import type { CharacterCard } from "@tcg/lorcana-types";

export const pjPeteCaughtUpInTheMusic: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "a30-1",
      name: "SHOUT OUT LOUD!",
      text: "SHOUT OUT LOUD! Whenever you play a song, this character gets +2 {S} this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 114,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "24576a183be2edf6bfc1f38f147eb03943d01bdc",
  },
  franchise: "Goofy Movie",
  fullName: "P.J. Pete - Caught Up in the Music",
  id: "a30",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "P.J. Pete",
  set: "009",
  strength: 3,
  text: "SHOUT OUT LOUD! Whenever you play a song, this character gets +2 {S} this turn.",
  version: "Caught Up in the Music",
  willpower: 5,
};
