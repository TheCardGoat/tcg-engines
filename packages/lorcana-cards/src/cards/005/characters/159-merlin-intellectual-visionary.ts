import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinIntellectualVisionary: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "1g2-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
      effect: {
        condition: {
          expression: "you used Shift to play him",
          type: "if",
        },
        then: {
          putInto: "hand",
          shuffle: true,
          type: "search-deck",
        },
        type: "conditional",
      },
      id: "1g2-2",
      name: "OVERDEVELOPED BRAIN",
      text: "OVERDEVELOPED BRAIN When you play this character, if you used Shift to play him, you may search your deck for any card, put that card into your hand, then shuffle your deck.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 159,
  cardType: "character",
  classifications: ["Floodborn", "Mentor", "Sorcerer"],
  cost: 6,
  externalIds: {
    ravensburger: "bba8990971606047f1bc8e18917bc3d0f888d38b",
  },
  franchise: "Sword in the Stone",
  fullName: "Merlin - Intellectual Visionary",
  id: "1g2",
  inkType: ["sapphire"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Merlin",
  set: "005",
  strength: 3,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Merlin.)\nOVERDEVELOPED BRAIN When you play this character, if you used Shift to play him, you may search your deck for any card, put that card into your hand, then shuffle your deck.",
  version: "Intellectual Visionary",
  willpower: 7,
};
