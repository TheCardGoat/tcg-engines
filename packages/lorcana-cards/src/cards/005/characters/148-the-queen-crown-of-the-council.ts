import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenCrownOfTheCouncil: CharacterCard = {
  abilities: [
    {
      id: "vdv-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "CHOSEN_CHARACTER",
          type: "put-on-bottom",
        },
        type: "optional",
      },
      id: "vdv-2",
      name: "GATHERER OF THE WICKED",
      text: "GATHERER OF THE WICKED When you play this character, look at the top 3 cards of your deck. You may reveal any number of character cards named The Queen and put them into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 148,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Queen", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "711db291586153124e70c559ba0991a638fc6d4f",
  },
  franchise: "Snow White",
  fullName: "The Queen - Crown of the Council",
  id: "vdv",
  inkType: ["sapphire"],
  inkable: false,
  lore: 2,
  name: "The Queen",
  set: "005",
  strength: 3,
  text: "Ward (Opponents can't choose this character except to challenge.)\nGATHERER OF THE WICKED When you play this character, look at the top 3 cards of your deck. You may reveal any number of character cards named The Queen and put them into your hand. Put the rest on the bottom of your deck in any order.",
  version: "Crown of the Council",
  willpower: 2,
};
