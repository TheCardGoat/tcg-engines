import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanImperialGeneral: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "17b-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
      id: "17b-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "grant-ability",
        ability: "can-challenge-ready",
        target: "SELF",
      },
      id: "17b-3",
      name: "EXCEPTIONAL LEADER",
      text: "EXCEPTIONAL LEADER Whenever this character challenges another character, your other characters gain “This character can challenge ready characters” this turn.",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 141,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Princess"],
  cost: 7,
  externalIds: {
    ravensburger: "9c206f63c6f0526ce5aac53a49c9fe58909c52ee",
  },
  franchise: "Mulan",
  fullName: "Mulan - Imperial General",
  id: "17b",
  inkType: ["ruby", "steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Mulan",
  set: "007",
  strength: 5,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Mulan.)\nEvasive (Only characters with Evasive can challenge this character.)\nEXCEPTIONAL LEADER Whenever this character challenges another character, your other characters gain “This character can challenge ready characters” this turn.",
  version: "Imperial General",
  willpower: 6,
};
