import type { CharacterCard } from "@tcg/lorcana-types";

export const rafikiEtherealGuide: CharacterCard = {
  id: "yg2",
  cardType: "character",
  name: "Rafiki",
  version: "Ethereal Guide",
  fullName: "Rafiki - Ethereal Guide",
  inkType: ["amethyst"],
  franchise: "Lion King",
  set: "006",
  text: "Shift 7 (You may pay 7 {I} to play this on top of one of your characters named Rafiki.)\nASTRAL ATTUNEMENT During your turn, whenever a card is put into your inkwell, you may draw a card.",
  cost: 9,
  strength: 6,
  willpower: 6,
  lore: 4,
  cardNumber: 52,
  inkable: false,
  externalIds: {
    ravensburger: "7c256dab47d16a89c757b84431b8ddca2fb61add",
  },
  abilities: [
    {
      id: "yg2-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 7,
      },
      text: "Shift 7",
    },
    {
      id: "yg2-2",
      type: "triggered",
      name: "ASTRAL ATTUNEMENT",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "ASTRAL ATTUNEMENT During your turn, whenever a card is put into your inkwell, you may draw a card.",
    },
  ],
  classifications: ["Floodborn", "Mentor", "Sorcerer"],
};
