import type { CharacterCard } from "@tcg/lorcana-types";

export const gustavTheGiantTerrorOfTheKingdom: CharacterCard = {
  id: "5zz",
  cardType: "character",
  name: "Gustav the Giant",
  version: "Terror of the Kingdom",
  fullName: "Gustav the Giant - Terror of the Kingdom",
  inkType: ["steel"],
  set: "003",
  text: "ALL TIED UP This character enters play exerted and can't ready at the start of your turn.\nBREAK FREE During your turn, whenever one of your other characters banishes another character in a challenge, you may ready this character.",
  cost: 3,
  strength: 6,
  willpower: 6,
  lore: 1,
  cardNumber: 173,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "159f4fcc6c094491eec5963594b65da8fb42798f",
  },
  abilities: [
    {
      id: "5zz-1",
      type: "static",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "restriction",
            restriction: "enters-play-exerted",
            target: "SELF",
          },
          {
            type: "restriction",
            restriction: "cant-ready",
            target: "SELF",
          },
        ],
      },
      name: "ALL TIED UP",
      text: "ALL TIED UP This character enters play exerted and can't ready at the start of your turn.",
    },
    {
      id: "5zz-2",
      type: "triggered",
      name: "BREAK FREE",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "ready",
          target: {
            selector: "self",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "BREAK FREE During your turn, whenever one of your other characters banishes another character in a challenge, you may ready this character.",
    },
  ],
  classifications: ["Dreamborn", "Villain"],
};
