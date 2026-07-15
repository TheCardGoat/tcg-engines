import type { CharacterCard } from "@tcg/lorcana-types";

export const aliceCourageousKeyholder: CharacterCard = {
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
      id: "65f-1",
      name: "THIS WAY OUT",
      text: "THIS WAY OUT When you play this character, you may ready chosen damaged character of yours. They can't quest for the rest of this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 127,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "162b1048dfcb2afc70a5bd30eee1680b2da51299",
  },
  franchise: "Alice in Wonderland",
  fullName: "Alice - Courageous Keyholder",
  id: "65f",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Alice",
  set: "008",
  strength: 2,
  text: "THIS WAY OUT When you play this character, you may ready chosen damaged character of yours. They can't quest for the rest of this turn.",
  version: "Courageous Keyholder",
  willpower: 4,
};
