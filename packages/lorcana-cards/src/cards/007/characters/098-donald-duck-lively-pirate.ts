import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckLivelyPirate: CharacterCard = {
  id: "17f",
  cardType: "character",
  name: "Donald Duck",
  version: "Lively Pirate",
  fullName: "Donald Duck - Lively Pirate",
  inkType: ["emerald"],
  set: "007",
  text: "DUCK OF ACTION Whenever this character is challenged, you may return an action card that isn't a song card from your discard to your hand.",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 2,
  cardNumber: 98,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "9c7d800c6c0e522c7c7224a1dfb5b79bcac0edee",
  },
  abilities: [
    {
      id: "17f-1",
      type: "triggered",
      name: "DUCK OF ACTION",
      trigger: {
        event: "challenged",
        timing: "whenever",
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
            cardTypes: ["card"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "DUCK OF ACTION Whenever this character is challenged, you may return an action card that isn't a song card from your discard to your hand.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Pirate"],
};
