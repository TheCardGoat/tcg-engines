import type { CharacterCard } from "@tcg/lorcana-types";
import { timothyQMouseFlightInstructorI18n } from "./047-timothy-q-mouse-flight-instructor.i18n";

export const timothyQMouseFlightInstructor: CharacterCard = {
  id: "WXB",
  canonicalId: "ci_WXB",
  reprints: ["set9-047"],
  cardType: "character",
  name: "Timothy Q. Mouse",
  version: "Flight Instructor",
  inkType: ["amethyst"],
  franchise: "Dumbo",
  set: "009",
  cardNumber: 47,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7132ae64563f4ca688e7033e90cf50fb",
    tcgPlayer: 647678,
  },
  text: [
    {
      title: "LET'S SHOW 'EM, DUMBO!",
      description: "While you have a character with Evasive in play, this character gets +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
  abilities: [
    {
      id: "101-1",
      name: "LET'S SHOW 'EM, DUMBO!",
      type: "static",
      condition: {
        type: "has-character-with-keyword",
        keyword: "Evasive",
        controller: "you",
      },
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      text: "LET'S SHOW 'EM, DUMBO! While you have a character with Evasive in play, this character gets +1 {L}.",
    },
  ],
  i18n: timothyQMouseFlightInstructorI18n,
};
