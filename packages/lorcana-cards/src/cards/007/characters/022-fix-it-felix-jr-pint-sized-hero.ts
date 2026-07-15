import type { CharacterCard } from "@tcg/lorcana-types";

export const fixitFelixJrPintsizedHero: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          duration: "this-turn",
          restriction: "cant-quest",
          target: "SELF",
          type: "restriction",
        },
        type: "optional",
      },
      id: "b28-1",
      name: "LET'S GET TO WORK",
      text: "LET'S GET TO WORK Whenever you return a Racer character card from your discard to your hand, you may ready chosen Racer character. They can't quest for the rest of this turn.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 22,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Racer"],
  cost: 5,
  externalIds: {
    ravensburger: "27de73ed728b5b8444dfa4aee552af1f119f9f7b",
  },
  franchise: "Wreck It Ralph",
  fullName: "Fix-It Felix, Jr. - Pint-Sized Hero",
  id: "b28",
  inkType: ["amber", "ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Fix-It Felix, Jr.",
  set: "007",
  strength: 4,
  text: "LET'S GET TO WORK Whenever you return a Racer character card from your discard to your hand, you may ready chosen Racer character. They can't quest for the rest of this turn.",
  version: "Pint-Sized Hero",
  willpower: 4,
};
