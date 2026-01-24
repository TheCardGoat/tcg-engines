import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineDesertWarrior: CharacterCard = {
  id: "160",
  cardType: "character",
  name: "Jasmine",
  version: "Desert Warrior",
  fullName: "Jasmine - Desert Warrior",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "004",
  text: "CUNNING MANEUVER When you play this character and whenever she's challenged, each opponent chooses and discards a card.",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 78,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "9770423d3353e97f5163db0a1d9ae9050969620a",
  },
  abilities: [
    {
      id: "160-1",
      type: "triggered",
      name: "CUNNING MANEUVER When you play this character and",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "discard",
        amount: 1,
        target: "EACH_OPPONENT",
        chosen: true,
      },
      text: "CUNNING MANEUVER When you play this character and whenever she's challenged, each opponent chooses and discards a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
};
