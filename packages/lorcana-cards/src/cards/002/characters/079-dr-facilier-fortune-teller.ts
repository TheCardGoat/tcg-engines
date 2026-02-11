import type { CharacterCard } from "@tcg/lorcana-types";

export const drFacilierFortuneTeller: CharacterCard = {
  abilities: [
    {
      id: "h8r-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
        duration: "until-start-of-next-turn",
      },
      id: "h8r-2",
      name: "YOU'RE IN MY WORLD",
      text: "YOU'RE IN MY WORLD Whenever this character quests, chosen opposing character can't quest during their next turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 79,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  cost: 7,
  externalIds: {
    ravensburger: "3e258200882f4b5dcbec8289f3c82c2c45974698",
  },
  franchise: "Princess and the Frog",
  fullName: "Dr. Facilier - Fortune Teller",
  id: "h8r",
  inkType: ["emerald"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Dr. Facilier",
  set: "002",
  strength: 4,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nYOU'RE IN MY WORLD Whenever this character quests, chosen opposing character can't quest during their next turn.",
  version: "Fortune Teller",
  willpower: 4,
};
