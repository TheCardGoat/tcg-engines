import type { CharacterCard } from "@tcg/lorcana-types";

export const rafikiEtherealGuide: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 7,
      },
      id: "yg2-1",
      keyword: "Shift",
      text: "Shift 7",
      type: "keyword",
    },
    {
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "yg2-2",
      name: "ASTRAL ATTUNEMENT",
      text: "ASTRAL ATTUNEMENT During your turn, whenever a card is put into your inkwell, you may draw a card.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 52,
  cardType: "character",
  classifications: ["Floodborn", "Mentor", "Sorcerer"],
  cost: 9,
  externalIds: {
    ravensburger: "7c256dab47d16a89c757b84431b8ddca2fb61add",
  },
  franchise: "Lion King",
  fullName: "Rafiki - Ethereal Guide",
  id: "yg2",
  inkType: ["amethyst"],
  inkable: false,
  lore: 4,
  name: "Rafiki",
  set: "006",
  strength: 6,
  text: "Shift 7 (You may pay 7 {I} to play this on top of one of your characters named Rafiki.)\nASTRAL ATTUNEMENT During your turn, whenever a card is put into your inkwell, you may draw a card.",
  version: "Ethereal Guide",
  willpower: 6,
};
