import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseWideeyedDiver: CharacterCard = {
  id: "974",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Wide-Eyed Diver",
  fullName: "Minnie Mouse - Wide-Eyed Diver",
  inkType: ["ruby"],
  set: "002",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Minnie Mouse.)\nEvasive (Only characters with Evasive can challenge this character.)\nUNDERSEA ADVENTURE Whenever you play a second action in a turn, this character gets +2 {L} this turn.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 114,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "21266db7b36d71ffdf1724077c586bfa8a5b870e",
  },
  abilities: [
    {
      id: "974-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 2,
      },
      text: "Shift 2",
    },
    {
      id: "974-2",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "974-3",
      type: "triggered",
      name: "UNDERSEA ADVENTURE",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
        duration: "this-turn",
      },
      text: "UNDERSEA ADVENTURE Whenever you play a second action in a turn, this character gets +2 {L} this turn.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
};
