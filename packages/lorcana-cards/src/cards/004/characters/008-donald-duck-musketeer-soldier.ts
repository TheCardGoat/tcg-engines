import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckMusketeerSoldier: CharacterCard = {
  abilities: [
    {
      id: "1hr-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1hr-2",
      name: "WAIT FOR ME!",
      text: "WAIT FOR ME! When you play this character, chosen character gets +1 {L} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 8,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Musketeer"],
  cost: 3,
  externalIds: {
    ravensburger: "c1c6f67d0f2105260caa599f400e2bff4df22c37",
  },
  fullName: "Donald Duck - Musketeer Soldier",
  id: "1hr",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Donald Duck",
  set: "004",
  strength: 2,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nWAIT FOR ME! When you play this character, chosen character gets +1 {L} this turn.",
  version: "Musketeer Soldier",
  willpower: 3,
};
