import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenCrownOfTheCouncil: CharacterCard = {
  id: "vdv",
  cardType: "character",
  name: "The Queen",
  version: "Crown of the Council",
  fullName: "The Queen - Crown of the Council",
  inkType: ["sapphire"],
  franchise: "Snow White",
  set: "005",
  text: "Ward (Opponents can't choose this character except to challenge.)\nGATHERER OF THE WICKED When you play this character, look at the top 3 cards of your deck. You may reveal any number of character cards named The Queen and put them into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 4,
  strength: 3,
  willpower: 2,
  lore: 2,
  cardNumber: 148,
  inkable: false,
  externalIds: {
    ravensburger: "711db291586153124e70c559ba0991a638fc6d4f",
  },
  abilities: [
    {
      id: "vdv-1",
      type: "keyword",
      keyword: "Ward",
    },
    {
      id: "vdv-2",
      name: "GATHERER OF THE WICKED",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen", "Sorcerer"],
};
