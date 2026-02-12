import type { CharacterCard } from "@tcg/lorcana-types";

export const isabelaMadrigalInTheMoment: CharacterCard = {
  abilities: [
    {
      effect: {
        restriction: "cant-be-challenged",
        target: "SELF",
        type: "restriction",
      },
      id: "xh0-1",
      name: "I'M TIRED OF PERFECT",
      text: "I'M TIRED OF PERFECT Whenever one of your characters sings a song, this character can't be challenged until the start of your next turn.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 25,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Madrigal"],
  cost: 5,
  externalIds: {
    ravensburger: "78a3743253e0c1d99573f5b0580092912919c335",
  },
  franchise: "Encanto",
  fullName: "Isabela Madrigal - In the Moment",
  id: "xh0",
  inkType: ["amber"],
  inkable: false,
  lore: 4,
  missingTests: true,
  name: "Isabela Madrigal",
  set: "007",
  strength: 3,
  text: "I'M TIRED OF PERFECT Whenever one of your characters sings a song, this character can't be challenged until the start of your next turn.",
  version: "In the Moment",
  willpower: 3,
};
