import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaIceMaker: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "1v2-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
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
      id: "1v2-2",
      name: "WINTER WALL",
      text: "WINTER WALL Whenever this character quests, you may exert chosen character. If you do and you have a character named Anna in play, the chosen character can’t ready at the start of their next turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 69,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Queen", "Sorcerer"],
  cost: 7,
  externalIds: {
    ravensburger: "f288eb233a11571c7c54690d782dcb3cf69e5c05",
  },
  franchise: "Frozen",
  fullName: "Elsa - Ice Maker",
  id: "1v2",
  inkType: ["amethyst", "sapphire"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Elsa",
  set: "007",
  strength: 5,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Elsa.)\nWINTER WALL Whenever this character quests, you may exert chosen character. If you do and you have a character named Anna in play, the chosen character can’t ready at the start of their next turn.",
  version: "Ice Maker",
  willpower: 5,
};
