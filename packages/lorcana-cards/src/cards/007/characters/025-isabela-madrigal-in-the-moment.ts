import type { CharacterCard } from "@tcg/lorcana-types";

export const isabelaMadrigalInTheMoment: CharacterCard = {
  id: "xh0",
  cardType: "character",
  name: "Isabela Madrigal",
  version: "In the Moment",
  fullName: "Isabela Madrigal - In the Moment",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "007",
  text: "I'M TIRED OF PERFECT Whenever one of your characters sings a song, this character can't be challenged until the start of your next turn.",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 4,
  cardNumber: 25,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "78a3743253e0c1d99573f5b0580092912919c335",
  },
  abilities: [
    {
      id: "xh0-1",
      type: "triggered",
      name: "I'M TIRED OF PERFECT",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "SELF",
      },
      text: "I'M TIRED OF PERFECT Whenever one of your characters sings a song, this character can't be challenged until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};
