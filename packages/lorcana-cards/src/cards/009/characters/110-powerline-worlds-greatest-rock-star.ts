import type { CharacterCard } from "@tcg/lorcana-types";

export const powerlineWorldsGreatestRockStar: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "k9i-1",
      keyword: "Shift",
      text: "Shift 4 {I}",
      type: "keyword",
    },
    {
      id: "k9i-2",
      keyword: "Singer",
      text: "Singer 9",
      type: "keyword",
      value: 9,
    },
    {
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      id: "k9i-3",
      name: "MASH-UP Once",
      text: "MASH-UP Once during your turn, whenever this character sings a song, look at the top 4 cards of your deck. You may reveal a song card with cost 9 or less and play it for free. Put the rest on the bottom of your deck in any order.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 110,
  cardType: "character",
  classifications: ["Floodborn"],
  cost: 6,
  externalIds: {
    ravensburger: "4908b40f487702590869bdde1fc8f15501f2b8c7",
  },
  franchise: "Goofy Movie",
  fullName: "Powerline - World's Greatest Rock Star",
  id: "k9i",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Powerline",
  set: "009",
  strength: 6,
  text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Powerline.)\nSinger 9\nMASH-UP Once during your turn, whenever this character sings a song, look at the top 4 cards of your deck. You may reveal a song card with cost 9 or less and play it for free. Put the rest on the bottom of your deck in any order.",
  version: "World's Greatest Rock Star",
  willpower: 4,
};
