import type { CharacterCard } from "@tcg/lorcana-types";

export const powerlineWorldsGreatestRockStar: CharacterCard = {
  id: "k9i",
  cardType: "character",
  name: "Powerline",
  version: "World's Greatest Rock Star",
  fullName: "Powerline - World's Greatest Rock Star",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "009",
  text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Powerline.)\nSinger 9\nMASH-UP Once during your turn, whenever this character sings a song, look at the top 4 cards of your deck. You may reveal a song card with cost 9 or less and play it for free. Put the rest on the bottom of your deck in any order.",
  cost: 6,
  strength: 6,
  willpower: 4,
  lore: 2,
  cardNumber: 110,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4908b40f487702590869bdde1fc8f15501f2b8c7",
  },
  abilities: [
    {
      id: "k9i-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4 {I}",
    },
    {
      id: "k9i-2",
      type: "keyword",
      keyword: "Singer",
      value: 9,
      text: "Singer 9",
    },
    {
      id: "k9i-3",
      type: "triggered",
      name: "MASH-UP Once",
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      text: "MASH-UP Once during your turn, whenever this character sings a song, look at the top 4 cards of your deck. You may reveal a song card with cost 9 or less and play it for free. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Floodborn"],
};
