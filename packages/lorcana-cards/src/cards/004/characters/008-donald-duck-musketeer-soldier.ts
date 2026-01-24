import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckMusketeerSoldier: CharacterCard = {
  id: "1hr",
  cardType: "character",
  name: "Donald Duck",
  version: "Musketeer Soldier",
  fullName: "Donald Duck - Musketeer Soldier",
  inkType: ["amber"],
  set: "004",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nWAIT FOR ME! When you play this character, chosen character gets +1 {L} this turn.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 8,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c1c6f67d0f2105260caa599f400e2bff4df22c37",
  },
  abilities: [
    {
      id: "1hr-1",
      type: "keyword",
      keyword: "Bodyguard",
      text: "Bodyguard",
    },
    {
      id: "1hr-2",
      type: "triggered",
      name: "WAIT FOR ME!",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
        duration: "this-turn",
      },
      text: "WAIT FOR ME! When you play this character, chosen character gets +1 {L} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Musketeer"],
};
