import type { CharacterCard } from "@tcg/lorcana-types";

export const shereKhanFearsomeTiger: CharacterCard = {
  abilities: [
    {
      id: "1gj-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "put-damage",
        },
        type: "optional",
      },
      id: "1gj-2",
      name: "ON THE HUNT",
      text: "ON THE HUNT Whenever this character quests, banish chosen opposing damaged character. Then, you may put 1 damage counter on another chosen character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 88,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 6,
  externalIds: {
    ravensburger: "bd5700db4398aef9046429719282594d5034b5a8",
  },
  franchise: "Jungle Book",
  fullName: "Shere Khan - Fearsome Tiger",
  id: "1gj",
  inkType: ["emerald"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Shere Khan",
  set: "010",
  strength: 5,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nON THE HUNT Whenever this character quests, banish chosen opposing damaged character. Then, you may put 1 damage counter on another chosen character.",
  version: "Fearsome Tiger",
  willpower: 4,
};
