import type { CharacterCard } from "@tcg/lorcana-types";

export const cruellaDeVilStyleIcon: CharacterCard = {
  id: "1r1",
  cardType: "character",
  name: "Cruella De Vil",
  version: "Style Icon",
  fullName: "Cruella De Vil - Style Icon",
  inkType: ["sapphire"],
  franchise: "101 Dalmatians",
  set: "009",
  text: "OUT OF SEASON Once during your turn, whenever a character with cost 2 or less is banished, put the top card of your deck into your inkwell facedown and exerted.\nINSULTING REMARK During your turn, each opposing character with cost 2 or less gets -1 {S}.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 143,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "e5bb1685c01df7b1a16869d418b4b0beac7c54a7",
  },
  abilities: [
    {
      id: "1r1-1",
      type: "triggered",
      name: "OUT OF SEASON Once",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "put-into-inkwell",
        source: "top-of-deck",
        target: "CONTROLLER",
        exerted: true,
        facedown: true,
      },
      text: "OUT OF SEASON Once during your turn, whenever a character with cost 2 or less is banished, put the top card of your deck into your inkwell facedown and exerted.",
    },
    {
      id: "1r1-2",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "CHOSEN_CHARACTER",
      },
      text: "INSULTING REMARK During your turn, each opposing character with cost 2 or less gets -1 {S}.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
