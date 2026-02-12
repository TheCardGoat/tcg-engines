import type { CharacterCard } from "@tcg/lorcana-types";

export const frecklesGoodBoy: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: -1,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1v6-1",
      name: "JUST SO CUTE!",
      text: "JUST SO CUTE! When you play this character, chosen opposing character gets -1 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 168,
  cardType: "character",
  classifications: ["Storyborn", "Puppy"],
  cost: 2,
  externalIds: {
    ravensburger: "f21c908b247d9cbe4e6848d00540186be031c963",
  },
  franchise: "101 Dalmatians",
  fullName: "Freckles - Good Boy",
  id: "1v6",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Freckles",
  set: "007",
  strength: 2,
  text: "JUST SO CUTE! When you play this character, chosen opposing character gets -1 {S} this turn.",
  version: "Good Boy",
  willpower: 2,
};
