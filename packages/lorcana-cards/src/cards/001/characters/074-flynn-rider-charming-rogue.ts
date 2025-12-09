import type { CharacterCard } from "@tcg/lorcana";

export const flynnRiderCharmingRogue: CharacterCard = {
  id: "qk8",
  cardType: "character",
  name: "Flynn Rider",
  version: "Charming Rogue",
  fullName: "Flynn Rider - Charming Rogue",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "001",
  text: "HERE COMES THE SMOLDER Whenever this character is challenged, the challenging player chooses and discards a card.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  cardNumber: 74,
  inkable: true,
  externalIds: {
    ravensburger: "5fbb4404791aacf38f1c7a5736e154eb4a398b23",
  },
  abilities: [
    {
      id: "qk8-1",
      text: "HERE COMES THE SMOLDER Whenever this character is challenged, the challenging player chooses and discards a card.",
      name: "HERE COMES THE SMOLDER",
      type: "triggered",
      trigger: {
        event: "challenged",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "discard",
        amount: 1,
        target: "CONTROLLER",
        chosen: true,
      },
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
