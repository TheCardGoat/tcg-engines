import type { CharacterCard } from "@tcg/lorcana-types";

export const fixitFelixJrPintsizedHero: CharacterCard = {
  id: "b28",
  cardType: "character",
  name: "Fix-It Felix, Jr.",
  version: "Pint-Sized Hero",
  fullName: "Fix-It Felix, Jr. - Pint-Sized Hero",
  inkType: ["amber", "ruby"],
  franchise: "Wreck It Ralph",
  set: "007",
  text: "LET'S GET TO WORK Whenever you return a Racer character card from your discard to your hand, you may ready chosen Racer character. They can't quest for the rest of this turn.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 22,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "27de73ed728b5b8444dfa4aee552af1f119f9f7b",
  },
  abilities: [
    {
      id: "b28-1",
      type: "triggered",
      name: "LET'S GET TO WORK",
      effect: {
        type: "optional",
        effect: {
          type: "restriction",
          restriction: "cant-quest",
          target: "SELF",
          duration: "this-turn",
        },
        chooser: "CONTROLLER",
      },
      text: "LET'S GET TO WORK Whenever you return a Racer character card from your discard to your hand, you may ready chosen Racer character. They can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Racer"],
};
