import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseWideeyedDiver: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 2,
      },
      id: "974-1",
      keyword: "Shift",
      text: "Shift 2",
      type: "keyword",
    },
    {
      id: "974-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
        duration: "this-turn",
      },
      id: "974-3",
      name: "UNDERSEA ADVENTURE",
      text: "UNDERSEA ADVENTURE Whenever you play a second action in a turn, this character gets +2 {L} this turn.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 114,
  cardType: "character",
  classifications: ["Floodborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "21266db7b36d71ffdf1724077c586bfa8a5b870e",
  },
  fullName: "Minnie Mouse - Wide-Eyed Diver",
  id: "974",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Minnie Mouse",
  set: "002",
  strength: 2,
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Minnie Mouse.)\nEvasive (Only characters with Evasive can challenge this character.)\nUNDERSEA ADVENTURE Whenever you play a second action in a turn, this character gets +2 {L} this turn.",
  version: "Wide-Eyed Diver",
  willpower: 3,
};
