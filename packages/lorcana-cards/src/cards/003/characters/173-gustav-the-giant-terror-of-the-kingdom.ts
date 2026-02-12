import type { CharacterCard } from "@tcg/lorcana-types";

export const gustavTheGiantTerrorOfTheKingdom: CharacterCard = {
  abilities: [
    {
      effect: {
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
        type: "sequence",
      },
      id: "5zz-1",
      name: "ALL TIED UP",
      text: "ALL TIED UP This character enters play exerted and can't ready at the start of your turn.",
      type: "static",
    },
    {
      effect: {
        chooser: "CONTROLLER",
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
        type: "optional",
      },
      id: "5zz-2",
      name: "BREAK FREE",
      text: "BREAK FREE During your turn, whenever one of your other characters banishes another character in a challenge, you may ready this character.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 173,
  cardType: "character",
  classifications: ["Dreamborn", "Villain"],
  cost: 3,
  externalIds: {
    ravensburger: "159f4fcc6c094491eec5963594b65da8fb42798f",
  },
  fullName: "Gustav the Giant - Terror of the Kingdom",
  id: "5zz",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Gustav the Giant",
  set: "003",
  strength: 6,
  text: "ALL TIED UP This character enters play exerted and can't ready at the start of your turn.\nBREAK FREE During your turn, whenever one of your other characters banishes another character in a challenge, you may ready this character.",
  version: "Terror of the Kingdom",
  willpower: 6,
};
