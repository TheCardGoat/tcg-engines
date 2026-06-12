import type { CharacterCard } from "@tcg/lorcana-types";
import { jasmineDesertWarriorI18n } from "./078-jasmine-desert-warrior.i18n";

export const jasmineDesertWarrior: CharacterCard = {
  id: "iKc",
  canonicalId: "ci_C4u",
  reprints: ["set4-078"],
  cardType: "character",
  name: "Jasmine",
  version: "Desert Warrior",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "004",
  cardNumber: 78,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_54e413e671dc4fa3872b3481db960d47",
    tcgPlayer: 551944,
  },
  text: [
    {
      title: "CUNNING MANEUVER",
      description:
        "When you play this character and whenever she's challenged, each opponent chooses and discards a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        amount: 1,
        chosen: true,
        target: "EACH_OPPONENT",
        type: "discard",
      },
      id: "160-1",
      name: "CUNNING MANEUVER",
      text: "CUNNING MANEUVER When you play this character and whenever she's challenged, each opponent chooses and discards a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        amount: 1,
        chosen: true,
        target: "EACH_OPPONENT",
        type: "discard",
      },
      id: "160-2",
      name: "CUNNING MANEUVER",
      text: "CUNNING MANEUVER When you play this character and whenever she's challenged, each opponent chooses and discards a card.",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: jasmineDesertWarriorI18n,
};
