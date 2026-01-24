import type { CharacterCard } from "@tcg/lorcana-types";

export const nickWildeWilyFox: CharacterCard = {
  id: "1uh",
  cardType: "character",
  name: "Nick Wilde",
  version: "Wily Fox",
  fullName: "Nick Wilde - Wily Fox",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "002",
  text: "IT'S CALLED A HUSTLE When you play this character, you may return an item card named Pawpsicle from your discard to your hand.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 154,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ef92275edba74ffeb10fbecd5ba1ae1a4ba84c2a",
  },
  abilities: [
    {
      id: "1uh-1",
      type: "triggered",
      name: "IT'S CALLED A HUSTLE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "IT'S CALLED A HUSTLE When you play this character, you may return an item card named Pawpsicle from your discard to your hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
