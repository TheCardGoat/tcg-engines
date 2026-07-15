import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineDesertWarrior: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        chosen: true,
        target: "EACH_OPPONENT",
        type: "discard",
      },
      id: "160-1",
      name: "CUNNING MANEUVER When you play this character and",
      text: "CUNNING MANEUVER When you play this character and whenever she's challenged, each opponent chooses and discards a card.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 78,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Princess"],
  cost: 5,
  externalIds: {
    ravensburger: "9770423d3353e97f5163db0a1d9ae9050969620a",
  },
  franchise: "Aladdin",
  fullName: "Jasmine - Desert Warrior",
  id: "160",
  inkType: ["emerald"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Jasmine",
  set: "004",
  strength: 3,
  text: "CUNNING MANEUVER When you play this character and whenever she's challenged, each opponent chooses and discards a card.",
  version: "Desert Warrior",
  willpower: 3,
};
