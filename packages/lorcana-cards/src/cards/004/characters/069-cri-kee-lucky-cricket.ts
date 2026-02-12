import type { CharacterCard } from "@tcg/lorcana-types";

export const crikeeLuckyCricket: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 3,
        stat: "strength",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      id: "dzo-1",
      name: "SPREADING GOOD FORTUNE",
      text: "SPREADING GOOD FORTUNE When you play this character, your other characters get +3 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 69,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "326ceeec1de2883d7a709f109d2aaca1246a9156",
  },
  franchise: "Mulan",
  fullName: "Cri-Kee - Lucky Cricket",
  id: "dzo",
  inkType: ["emerald"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Cri-Kee",
  set: "004",
  strength: 3,
  text: "SPREADING GOOD FORTUNE When you play this character, your other characters get +3 {S} this turn.",
  version: "Lucky Cricket",
  willpower: 4,
};
