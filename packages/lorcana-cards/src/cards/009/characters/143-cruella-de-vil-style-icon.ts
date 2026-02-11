import type { CharacterCard } from "@tcg/lorcana-types";

export const cruellaDeVilStyleIcon: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "put-into-inkwell",
        source: "top-of-deck",
        target: "CONTROLLER",
        exerted: true,
        facedown: true,
      },
      id: "1r1-1",
      name: "OUT OF SEASON Once",
      text: "OUT OF SEASON Once during your turn, whenever a character with cost 2 or less is banished, put the top card of your deck into your inkwell facedown and exerted.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "CHOSEN_CHARACTER",
      },
      id: "1r1-2",
      text: "INSULTING REMARK During your turn, each opposing character with cost 2 or less gets -1 {S}.",
      type: "action",
    },
  ],
  cardNumber: 143,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 3,
  externalIds: {
    ravensburger: "e5bb1685c01df7b1a16869d418b4b0beac7c54a7",
  },
  franchise: "101 Dalmatians",
  fullName: "Cruella De Vil - Style Icon",
  id: "1r1",
  inkType: ["sapphire"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Cruella De Vil",
  set: "009",
  strength: 2,
  text: "OUT OF SEASON Once during your turn, whenever a character with cost 2 or less is banished, put the top card of your deck into your inkwell facedown and exerted.\nINSULTING REMARK During your turn, each opposing character with cost 2 or less gets -1 {S}.",
  version: "Style Icon",
  willpower: 3,
};
