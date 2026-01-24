import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaIceMaker: CharacterCard = {
  id: "1v2",
  cardType: "character",
  name: "Elsa",
  version: "Ice Maker",
  fullName: "Elsa - Ice Maker",
  inkType: ["amethyst", "sapphire"],
  franchise: "Frozen",
  set: "007",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Elsa.)\nWINTER WALL Whenever this character quests, you may exert chosen character. If you do and you have a character named Anna in play, the chosen character can’t ready at the start of their next turn.",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 69,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "f288eb233a11571c7c54690d782dcb3cf69e5c05",
  },
  abilities: [
    {
      id: "1v2-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
    {
      id: "1v2-2",
      type: "triggered",
      name: "WINTER WALL",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "exert",
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
      text: "WINTER WALL Whenever this character quests, you may exert chosen character. If you do and you have a character named Anna in play, the chosen character can’t ready at the start of their next turn.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Queen", "Sorcerer"],
};
