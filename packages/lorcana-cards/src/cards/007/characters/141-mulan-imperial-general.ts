import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanImperialGeneral: CharacterCard = {
  id: "17b",
  cardType: "character",
  name: "Mulan",
  version: "Imperial General",
  fullName: "Mulan - Imperial General",
  inkType: ["ruby", "steel"],
  franchise: "Mulan",
  set: "007",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Mulan.)\nEvasive (Only characters with Evasive can challenge this character.)\nEXCEPTIONAL LEADER Whenever this character challenges another character, your other characters gain “This character can challenge ready characters” this turn.",
  cost: 7,
  strength: 5,
  willpower: 6,
  lore: 2,
  cardNumber: 141,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9c206f63c6f0526ce5aac53a49c9fe58909c52ee",
  },
  abilities: [
    {
      id: "17b-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5",
    },
    {
      id: "17b-2",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "17b-3",
      type: "triggered",
      name: "EXCEPTIONAL LEADER",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "grant-ability",
        ability: "can-challenge-ready",
        target: "SELF",
      },
      text: "EXCEPTIONAL LEADER Whenever this character challenges another character, your other characters gain “This character can challenge ready characters” this turn.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
};
