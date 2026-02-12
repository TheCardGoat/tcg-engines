import type { CharacterCard } from "@tcg/lorcana-types";

export const nickWildeWilyFox: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "1uh-1",
      name: "IT'S CALLED A HUSTLE",
      text: "IT'S CALLED A HUSTLE When you play this character, you may return an item card named Pawpsicle from your discard to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 154,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "ef92275edba74ffeb10fbecd5ba1ae1a4ba84c2a",
  },
  franchise: "Zootropolis",
  fullName: "Nick Wilde - Wily Fox",
  id: "1uh",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Nick Wilde",
  set: "002",
  strength: 2,
  text: "IT'S CALLED A HUSTLE When you play this character, you may return an item card named Pawpsicle from your discard to your hand.",
  version: "Wily Fox",
  willpower: 4,
};
