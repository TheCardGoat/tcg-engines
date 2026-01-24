import type { CharacterCard } from "@tcg/lorcana-types";

export const shereKhanFearsomeTiger: CharacterCard = {
  id: "1gj",
  cardType: "character",
  name: "Shere Khan",
  version: "Fearsome Tiger",
  fullName: "Shere Khan - Fearsome Tiger",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "010",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nON THE HUNT Whenever this character quests, banish chosen opposing damaged character. Then, you may put 1 damage counter on another chosen character.",
  cost: 6,
  strength: 5,
  willpower: 4,
  lore: 2,
  cardNumber: 88,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "bd5700db4398aef9046429719282594d5034b5a8",
  },
  abilities: [
    {
      id: "1gj-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "1gj-2",
      type: "triggered",
      name: "ON THE HUNT",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-damage",
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "ON THE HUNT Whenever this character quests, banish chosen opposing damaged character. Then, you may put 1 damage counter on another chosen character.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
