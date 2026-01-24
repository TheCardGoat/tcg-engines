import type { CharacterCard } from "@tcg/lorcana-types";

export const frecklesGoodBoy: CharacterCard = {
  id: "1v6",
  cardType: "character",
  name: "Freckles",
  version: "Good Boy",
  fullName: "Freckles - Good Boy",
  inkType: ["sapphire"],
  franchise: "101 Dalmatians",
  set: "007",
  text: "JUST SO CUTE! When you play this character, chosen opposing character gets -1 {S} this turn.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 168,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f21c908b247d9cbe4e6848d00540186be031c963",
  },
  abilities: [
    {
      id: "1v6-1",
      type: "triggered",
      name: "JUST SO CUTE!",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "SELF",
        duration: "this-turn",
      },
      text: "JUST SO CUTE! When you play this character, chosen opposing character gets -1 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Puppy"],
};
