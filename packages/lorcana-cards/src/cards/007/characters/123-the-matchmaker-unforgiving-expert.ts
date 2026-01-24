import type { CharacterCard } from "@tcg/lorcana-types";

export const theMatchmakerUnforgivingExpert: CharacterCard = {
  id: "fhg",
  cardType: "character",
  name: "The Matchmaker",
  version: "Unforgiving Expert",
  fullName: "The Matchmaker - Unforgiving Expert",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "007",
  text: "YOU ARE A DISGRACE! Whenever this character challenges another character, each opponent loses 1 lore.",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 123,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "37ceefedfc5a4857cf51f3b75ec149712c62fdab",
  },
  abilities: [
    {
      id: "fhg-1",
      type: "triggered",
      name: "YOU ARE A DISGRACE!",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
      text: "YOU ARE A DISGRACE! Whenever this character challenges another character, each opponent loses 1 lore.",
    },
  ],
  classifications: ["Storyborn"],
};
