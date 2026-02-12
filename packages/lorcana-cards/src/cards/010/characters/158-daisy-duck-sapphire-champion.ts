import type { CharacterCard } from "@tcg/lorcana-types";

export const daisyDuckSapphireChampion: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
        value: 1,
      },
      id: "107-1",
      name: "STAND FAST Your other Sapphire",
      text: "STAND FAST Your other Sapphire characters gain Resist +1.",
      type: "static",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        type: "optional",
      },
      id: "107-2",
      name: "LOOK AHEAD",
      text: "LOOK AHEAD Whenever one of your other Sapphire characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 158,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 5,
  externalIds: {
    ravensburger: "8273e51ca5ba49aaebe8b395cd2687bc0abf59e0",
  },
  fullName: "Daisy Duck - Sapphire Champion",
  id: "107",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Daisy Duck",
  set: "010",
  strength: 5,
  text: "STAND FAST Your other Sapphire characters gain Resist +1. (Damage dealt to them is reduced by 1.)\nLOOK AHEAD Whenever one of your other Sapphire characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  version: "Sapphire Champion",
  willpower: 6,
};
