import type { CharacterCard } from "@tcg/lorcana-types";

export const theMatchmakerUnforgivingExpert: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
      id: "fhg-1",
      name: "YOU ARE A DISGRACE!",
      text: "YOU ARE A DISGRACE! Whenever this character challenges another character, each opponent loses 1 lore.",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 123,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 4,
  externalIds: {
    ravensburger: "37ceefedfc5a4857cf51f3b75ec149712c62fdab",
  },
  franchise: "Mulan",
  fullName: "The Matchmaker - Unforgiving Expert",
  id: "fhg",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "The Matchmaker",
  set: "007",
  strength: 4,
  text: "YOU ARE A DISGRACE! Whenever this character challenges another character, each opponent loses 1 lore.",
  version: "Unforgiving Expert",
  willpower: 3,
};
