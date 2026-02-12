import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckLivelyPirate: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
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
        type: "optional",
      },
      id: "17f-1",
      name: "DUCK OF ACTION",
      text: "DUCK OF ACTION Whenever this character is challenged, you may return an action card that isn't a song card from your discard to your hand.",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 98,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Pirate"],
  cost: 2,
  externalIds: {
    ravensburger: "9c7d800c6c0e522c7c7224a1dfb5b79bcac0edee",
  },
  fullName: "Donald Duck - Lively Pirate",
  id: "17f",
  inkType: ["emerald"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Donald Duck",
  set: "007",
  strength: 1,
  text: "DUCK OF ACTION Whenever this character is challenged, you may return an action card that isn't a song card from your discard to your hand.",
  version: "Lively Pirate",
  willpower: 1,
};
