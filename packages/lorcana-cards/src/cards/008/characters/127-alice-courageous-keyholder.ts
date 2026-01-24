import type { CharacterCard } from "@tcg/lorcana-types";

export const aliceCourageousKeyholder: CharacterCard = {
  id: "65f",
  cardType: "character",
  name: "Alice",
  version: "Courageous Keyholder",
  fullName: "Alice - Courageous Keyholder",
  inkType: ["ruby"],
  franchise: "Alice in Wonderland",
  set: "008",
  text: "THIS WAY OUT When you play this character, you may ready chosen damaged character of yours. They can't quest for the rest of this turn.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 127,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "162b1048dfcb2afc70a5bd30eee1680b2da51299",
  },
  abilities: [
    {
      id: "65f-1",
      type: "triggered",
      name: "THIS WAY OUT",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
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
      text: "THIS WAY OUT When you play this character, you may ready chosen damaged character of yours. They can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
